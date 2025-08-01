-- schema.sql

DROP TABLE IF EXISTS ProfessionalLanguages;
DROP TABLE IF EXISTS ProfessionalDomains;
DROP TABLE IF EXISTS ConnectionRequests; -- If you add this later
DROP TABLE IF EXISTS Clients; -- If you add this later
DROP TABLE IF EXISTS LegalProfessionals;
DROP TABLE IF EXISTS LegalDomains;
DROP TABLE IF EXISTS Languages;

CREATE TABLE LegalProfessionals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    profile_picture_url TEXT DEFAULT 'static/images/default_avatar.png', -- Add a default image path
    is_student BOOLEAN NOT NULL DEFAULT 0, -- 0 for Lawyer, 1 for Student
    years_of_practice INTEGER,
    bar_council_id TEXT,
    location_city TEXT NOT NULL,
    location_state TEXT,
    bio TEXT,
    pro_bono BOOLEAN NOT NULL DEFAULT 0,
    availability TEXT, -- e.g., 'Any Time', 'Weekends', 'Mon-Fri 9-5'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    -- No password hash in this basic example
);

CREATE TABLE LegalDomains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE Languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE ProfessionalDomains (
    professional_id INTEGER NOT NULL,
    domain_id INTEGER NOT NULL,
    FOREIGN KEY (professional_id) REFERENCES LegalProfessionals(id) ON DELETE CASCADE,
    FOREIGN KEY (domain_id) REFERENCES LegalDomains(id) ON DELETE CASCADE,
    PRIMARY KEY (professional_id, domain_id)
);

CREATE TABLE ProfessionalLanguages (
    professional_id INTEGER NOT NULL,
    language_id INTEGER NOT NULL,
    FOREIGN KEY (professional_id) REFERENCES LegalProfessionals(id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES Languages(id) ON DELETE CASCADE,
    PRIMARY KEY (professional_id, language_id)
);

-- Insert sample data

-- Languages
INSERT INTO Languages (name) VALUES ('English'), ('Hindi'), ('Gujarati'), ('Punjabi'), ('Tamil'), ('Telugu');

-- Legal Domains
INSERT INTO LegalDomains (name) VALUES ('Criminal Law'), ('Family Law'), ('Civil Law'), ('Corporate Law'), ('Intellectual Property'), ('Real Estate Law');

-- Legal Professionals (Sample)
-- Adv. Priya Sharma (matches screenshot somewhat)
INSERT INTO LegalProfessionals (full_name, email, is_student, years_of_practice, location_city, availability, pro_bono, bio)
VALUES ('Adv. Priya Sharma', 'priya.sharma@example.com', 0, 10, 'Delhi', 'Mon-Fri', 1, 'Experienced criminal lawyer focusing on defense cases.');

-- Adv. Rahul Verma (matches screenshot somewhat)
INSERT INTO LegalProfessionals (full_name, email, is_student, years_of_practice, location_city, availability, pro_bono, bio)
VALUES ('Adv. Rahul Verma', 'rahul.verma@example.com', 0, 8, 'Mumbai', 'Weekends', 0, 'Specializing in civil litigation and property disputes.');

-- Adv. Meera Patel (matches screenshot somewhat)
INSERT INTO LegalProfessionals (full_name, email, is_student, years_of_practice, location_city, availability, pro_bono, bio)
VALUES ('Adv. Meera Patel', 'meera.patel@example.com', 0, 12, 'Chandigarh', 'Mon-Sat', 1, 'Dedicated family lawyer handling divorce and custody matters.');

-- Law Student Anjali Singh
INSERT INTO LegalProfessionals (full_name, email, is_student, years_of_practice, location_city, availability, pro_bono, bio)
VALUES ('Anjali Singh', 'anjali.singh@student.example.com', 1, NULL, 'Delhi', 'Any Time', 1, 'Final year law student eager to assist with research and drafting under supervision.');

-- Law Student Vikram Rao
INSERT INTO LegalProfessionals (full_name, email, is_student, years_of_practice, location_city, availability, pro_bono, bio)
VALUES ('Vikram Rao', 'vikram.rao@student.example.com', 1, NULL, 'Mumbai', 'Evenings', 0, 'Law student with interest in corporate law and compliance.');

-- Link Professionals to Domains and Languages
-- Priya Sharma (Criminal Law; English, Hindi)
INSERT INTO ProfessionalDomains (professional_id, domain_id) VALUES (1, (SELECT id FROM LegalDomains WHERE name = 'Criminal Law'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (1, (SELECT id FROM Languages WHERE name = 'English'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (1, (SELECT id FROM Languages WHERE name = 'Hindi'));

-- Rahul Verma (Civil Law; English, Gujarati)
INSERT INTO ProfessionalDomains (professional_id, domain_id) VALUES (2, (SELECT id FROM LegalDomains WHERE name = 'Civil Law'));
INSERT INTO ProfessionalDomains (professional_id, domain_id) VALUES (2, (SELECT id FROM LegalDomains WHERE name = 'Real Estate Law'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (2, (SELECT id FROM Languages WHERE name = 'English'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (2, (SELECT id FROM Languages WHERE name = 'Gujarati'));

-- Meera Patel (Family Law; English, Punjabi, Hindi)
INSERT INTO ProfessionalDomains (professional_id, domain_id) VALUES (3, (SELECT id FROM LegalDomains WHERE name = 'Family Law'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (3, (SELECT id FROM Languages WHERE name = 'English'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (3, (SELECT id FROM Languages WHERE name = 'Punjabi'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (3, (SELECT id FROM Languages WHERE name = 'Hindi'));

-- Anjali Singh (Criminal Law, Family Law; English, Hindi)
INSERT INTO ProfessionalDomains (professional_id, domain_id) VALUES (4, (SELECT id FROM LegalDomains WHERE name = 'Criminal Law'));
INSERT INTO ProfessionalDomains (professional_id, domain_id) VALUES (4, (SELECT id FROM LegalDomains WHERE name = 'Family Law'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (4, (SELECT id FROM Languages WHERE name = 'English'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (4, (SELECT id FROM Languages WHERE name = 'Hindi'));

-- Vikram Rao (Corporate Law; English, Tamil)
INSERT INTO ProfessionalDomains (professional_id, domain_id) VALUES (5, (SELECT id FROM LegalDomains WHERE name = 'Corporate Law'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (5, (SELECT id FROM Languages WHERE name = 'English'));
INSERT INTO ProfessionalLanguages (professional_id, language_id) VALUES (5, (SELECT id FROM Languages WHERE name = 'Tamil'));