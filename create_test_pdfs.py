#!/usr/bin/env python3
"""
Create test PDFs for edge cases to verify the improvements
"""

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

def create_pdf(filename, name, email, phone, zipcode, summary):
    """Create a test PDF with specified data"""
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    y_position = height - inch

    # Name
    c.setFont("Helvetica-Bold", 16)
    c.drawString(inch, y_position, name)
    y_position -= 0.3 * inch

    # Contact info
    c.setFont("Helvetica", 10)
    c.drawString(inch, y_position, f"{email} | {phone} | {zipcode}")
    y_position -= 0.5 * inch

    # Summary
    c.setFont("Helvetica-Bold", 12)
    c.drawString(inch, y_position, "PROFESSIONAL SUMMARY")
    y_position -= 0.2 * inch
    c.setFont("Helvetica", 10)
    c.drawString(inch, y_position, summary)

    c.save()
    print(f"✓ Created {filename}")

# Test 1: Name with apostrophe (O'Brien)
create_pdf(
    "test_obrien.pdf",
    "Patrick O'Brien",
    "pobrien@email.com",
    "(555) 111-2222",
    "10001",
    "Software engineer with expertise in Python and JavaScript."
)

# Test 2: Name with internal capital (McDonald)
create_pdf(
    "test_mcdonald.pdf",
    "Sarah McDonald",
    "sarah.mcdonald@email.com",
    "(555) 333-4444",
    "20002",
    "Full-stack developer specializing in React and Node.js."
)

# Test 3: Name with prefix (van der Berg)
create_pdf(
    "test_vander.pdf",
    "Jan van der Berg",
    "jvdberg@email.com",
    "(555) 555-6666",
    "30003",
    "DevOps engineer with cloud architecture experience."
)

# Test 4: Name with title and suffix (Dr. Smith PhD)
create_pdf(
    "test_dr_smith.pdf",
    "Dr. Jane Smith PhD",
    "jane.smith@email.com",
    "(555) 777-8888",
    "40004",
    "Data scientist with machine learning expertise."
)

# Test 5: Name with hyphen (Mary-Jane)
create_pdf(
    "test_hyphen.pdf",
    "Mary-Jane Watson",
    "mj.watson@email.com",
    "(555) 999-0000",
    "50005",
    "Frontend developer focused on user experience."
)

# Test 6: ZIP+4 format
create_pdf(
    "test_zip4.pdf",
    "Robert Johnson",
    "rjohnson@email.com",
    "(555) 123-7890",
    "12345-6789",  # ZIP+4 format
    "Backend developer specializing in API design."
)

# Test 7: Name with Jr.
create_pdf(
    "test_junior.pdf",
    "Michael Brown Jr.",
    "mbrown@email.com",
    "(555) 456-1234",
    "60006",
    "Mobile developer with iOS and Android experience."
)

# Test 8: Spanish name with de la
create_pdf(
    "test_dela.pdf",
    "Carlos de la Cruz",
    "cdelacruz@email.com",
    "(555) 789-4561",
    "70007",
    "Cloud architect with AWS and Azure certifications."
)

print("\n✅ All test PDFs created successfully!")
print("\nTest files:")
print("  1. test_obrien.pdf - Apostrophe in name")
print("  2. test_mcdonald.pdf - Internal capital")
print("  3. test_vander.pdf - Dutch prefix 'van der'")
print("  4. test_dr_smith.pdf - Title Dr. and suffix PhD")
print("  5. test_hyphen.pdf - Hyphenated first name")
print("  6. test_zip4.pdf - ZIP+4 format (12345-6789)")
print("  7. test_junior.pdf - Jr. suffix")
print("  8. test_dela.pdf - Spanish prefix 'de la'")
