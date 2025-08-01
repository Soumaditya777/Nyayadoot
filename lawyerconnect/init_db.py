# init_db.py
import sqlite3
import os

DATABASE = 'database.db'
SCHEMA = 'schema.sql'

# Delete the database file if it exists to start fresh
if os.path.exists(DATABASE):
    os.remove(DATABASE)
    print(f"Removed existing database: {DATABASE}")

try:
    # Connect to the database (this will create the file if it doesn't exist)
    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()
    print(f"Database created: {DATABASE}")

    # Read the schema file
    with open(SCHEMA, 'r') as f:
        sql_script = f.read()

    # Execute the SQL script
    cursor.executescript(sql_script)
    print(f"Executed schema and inserted sample data from: {SCHEMA}")

    # Commit changes and close connection
    connection.commit()
    connection.close()
    print("Database initialized successfully.")

except sqlite3.Error as e:
    print(f"An error occurred: {e}")
except FileNotFoundError:
    print(f"Error: Schema file not found at {SCHEMA}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")