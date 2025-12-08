#!/usr/bin/env python3
"""
Create a sample resume PDF for testing the PDF extraction functionality
"""

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

def create_test_resume():
    filename = "test_resume.pdf"
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Starting position
    y_position = height - inch

    # Name (should be extracted)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(inch, y_position, "John Smith")
    y_position -= 0.3 * inch

    # Contact info
    c.setFont("Helvetica", 10)
    c.drawString(inch, y_position, "john.smith@email.com | (555) 123-4567 | 12345")
    y_position -= 0.5 * inch

    # Professional Summary
    c.setFont("Helvetica-Bold", 12)
    c.drawString(inch, y_position, "PROFESSIONAL SUMMARY")
    y_position -= 0.2 * inch
    c.setFont("Helvetica", 10)
    summary = "Experienced software engineer with 5+ years in full-stack development."
    c.drawString(inch, y_position, summary)
    y_position -= 0.5 * inch

    # Skills Section
    c.setFont("Helvetica-Bold", 12)
    c.drawString(inch, y_position, "SKILLS")
    y_position -= 0.2 * inch
    c.setFont("Helvetica", 10)
    c.drawString(inch, y_position, "Languages & More: Python, JavaScript, React, Node.js, PostgreSQL, Docker, AWS")
    y_position -= 0.5 * inch

    # Experience
    c.setFont("Helvetica-Bold", 12)
    c.drawString(inch, y_position, "EXPERIENCE")
    y_position -= 0.2 * inch
    c.setFont("Helvetica-Bold", 10)
    c.drawString(inch, y_position, "Senior Software Engineer | Tech Corp | 2020-Present")
    y_position -= 0.2 * inch
    c.setFont("Helvetica", 10)
    c.drawString(inch, y_position, "- Developed microservices using Python and FastAPI")
    y_position -= 0.15 * inch
    c.drawString(inch, y_position, "- Built React frontend applications with TypeScript")
    y_position -= 0.15 * inch
    c.drawString(inch, y_position, "- Managed PostgreSQL databases and Redis caching")
    y_position -= 0.5 * inch

    # Education
    c.setFont("Helvetica-Bold", 12)
    c.drawString(inch, y_position, "EDUCATION")
    y_position -= 0.2 * inch
    c.setFont("Helvetica", 10)
    c.drawString(inch, y_position, "Bachelor of Science in Computer Science | State University | 2018")
    y_position -= 0.5 * inch

    # Certifications
    c.setFont("Helvetica-Bold", 12)
    c.drawString(inch, y_position, "CERTIFICATIONS")
    y_position -= 0.2 * inch
    c.setFont("Helvetica", 10)
    c.drawString(inch, y_position, "AWS Certified Solutions Architect | 2022")

    c.save()
    print(f"✓ Created {filename}")
    return filename

if __name__ == "__main__":
    try:
        create_test_resume()
    except ImportError:
        print("Error: reportlab library not found")
        print("Install with: pip install reportlab")
