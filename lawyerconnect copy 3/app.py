# app.py
import sqlite3
from flask import Flask, render_template, request, g, abort
from datetime import datetime

app = Flask(__name__)
DATABASE = 'database.db'

# --- Database Helper Functions ---
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row # Return rows as dictionary-like objects
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    try:
        cur = get_db().execute(query, args)
        rv = cur.fetchall()
        return (rv[0] if rv else None) if one else rv
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        print(f"Query: {query}")
        print(f"Args: {args}")
        abort(500) # Internal Server Error


# --- Custom Jinja2 Filter ---
def format_date(value, format='%Y-%m-%d %H:%M:%S'):
    if value == "now":
        value = datetime.now()
    elif not isinstance(value, datetime):
        try:
            value = datetime.fromisoformat(value.rstrip('Z')) # Try ISO format
        except ValueError:
            try:
                value = datetime.strptime(str(value), '%Y-%m-%d %H:%M:%S') # Try another common format
            except ValueError:
                return value # If parsing fails, return as is
    return value.strftime(format)

app.jinja_env.filters['date'] = format_date


# --- Routes ---
@app.route('/')
def index():
    """Displays the main search form."""
    db = get_db()
    domains = []
    languages = []
    try:
        domains = db.execute("SELECT name FROM LegalDomains ORDER BY name").fetchall()
        languages = db.execute("SELECT name FROM Languages ORDER BY name").fetchall()
    except sqlite3.Error as e:
        print(f"Error fetching dropdown data: {e}")
        # Optionally, show an error message on the page

    # Define experience levels for the dropdown
    experience_levels = ['Law Student', '0-2 years', '3-5 years', '6-10 years', '10+ years']
    availability_options = ['Any Time', 'Weekends', 'Weekdays', 'Evenings', 'Mon-Fri', 'Mon-Sat'] # Match sample data if possible

    return render_template(
        'index.html',
        domains=domains,
        languages=languages,
        experience_levels=experience_levels,
        availability_options=availability_options
    )

@app.route('/search', methods=['POST'])
def search():
    """Handles the search form submission and displays results."""
    # Get filter criteria from the form
    legal_domain = request.form.get('legal_domain')
    language = request.form.get('language')
    experience = request.form.get('experience')
    availability = request.form.get('availability')
    location = request.form.get('location', '').strip() # Use strip()

    # --- Build the SQL Query Dynamically ---
    # Use aliases for clarity (lp=LegalProfessionals, ld=LegalDomains, l=Languages, etc.)
    base_query = """
        SELECT DISTINCT lp.id, lp.full_name, lp.profile_picture_url, lp.is_student,
               lp.years_of_practice, lp.location_city, lp.availability, lp.pro_bono, lp.bio
        FROM LegalProfessionals lp
        LEFT JOIN ProfessionalDomains pd ON lp.id = pd.professional_id
        LEFT JOIN LegalDomains ld ON pd.domain_id = ld.id
        LEFT JOIN ProfessionalLanguages pl ON lp.id = pl.professional_id
        LEFT JOIN Languages l ON pl.language_id = l.id
        WHERE 1=1
    """
    params = [] # Parameters for the SQL query to prevent injection

    if location:
        base_query += " AND lp.location_city LIKE ?"
        params.append(f"%{location}%") # Use LIKE for partial city match

    if legal_domain:
        base_query += " AND ld.name = ?"
        params.append(legal_domain)

    if language:
        base_query += " AND l.name = ?"
        params.append(language)

    if availability and availability != 'Any Time': # 'Any Time' implies no filtering needed
         base_query += " AND lp.availability = ?"
         params.append(availability)

    # Handle Experience Filter
    if experience == 'Law Student':
        base_query += " AND lp.is_student = 1"
    elif experience == '0-2 years':
        base_query += " AND lp.is_student = 0 AND lp.years_of_practice BETWEEN 0 AND 2"
    elif experience == '3-5 years':
        base_query += " AND lp.is_student = 0 AND lp.years_of_practice BETWEEN 3 AND 5"
    elif experience == '6-10 years':
        base_query += " AND lp.is_student = 0 AND lp.years_of_practice BETWEEN 6 AND 10"
    elif experience == '10+ years':
        base_query += " AND lp.is_student = 0 AND lp.years_of_practice >= 10"
    # If no experience is selected, it includes both students and lawyers of all experience levels

    base_query += " ORDER BY lp.full_name;" # Add ordering

    # --- Execute the main search query ---
    results = query_db(base_query, params)

    # --- Fetch full details for display (Languages, Domains) for each result ---
    professionals_list = []
    if results:
        for row in results:
            prof_dict = dict(row) # Convert Row object to dict

            # Fetch associated languages for this professional
            lang_rows = query_db("""
                SELECT l.name FROM Languages l
                JOIN ProfessionalLanguages pl ON l.id = pl.language_id
                WHERE pl.professional_id = ?
                ORDER BY l.name
            """, [prof_dict['id']])
            prof_dict['languages'] = [lang['name'] for lang in lang_rows]

            # Fetch associated domains for this professional
            domain_rows = query_db("""
                SELECT ld.name FROM LegalDomains ld
                JOIN ProfessionalDomains pd ON ld.id = pd.domain_id
                WHERE pd.professional_id = ?
                ORDER BY ld.name
            """, [prof_dict['id']])
            prof_dict['domains'] = [dom['name'] for dom in domain_rows]

            professionals_list.append(prof_dict)

    # --- Render results ---
    return render_template('results.html', professionals=professionals_list)

# Add a simple route for profile details (basic example)
@app.route('/profile/<int:professional_id>')
def profile(professional_id):
    """Displays a detailed profile page for a professional."""
    prof = query_db("SELECT * FROM LegalProfessionals WHERE id = ?", [professional_id], one=True)

    if prof is None:
        abort(404) # Not Found

    prof_dict = dict(prof)

    # Fetch associated languages
    lang_rows = query_db("""
        SELECT l.name FROM Languages l JOIN ProfessionalLanguages pl ON l.id = pl.language_id
        WHERE pl.professional_id = ? ORDER BY l.name
    """, [professional_id])
    prof_dict['languages'] = [lang['name'] for lang in lang_rows]

    # Fetch associated domains
    domain_rows = query_db("""
        SELECT ld.name FROM LegalDomains ld JOIN ProfessionalDomains pd ON ld.id = pd.domain_id
        WHERE pd.professional_id = ? ORDER BY ld.name
    """, [professional_id])
    prof_dict['domains'] = [dom['name'] for dom in domain_rows]

    return render_template('profile_detail.html', professional=prof_dict)


if __name__ == '__main__':
    print("Starting Flask app...")
    print("Make sure you have run 'python init_db.py' first to set up the database.")
    app.run(debug=True, port=5001)