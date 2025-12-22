
import requests
import json
import uuid
import time

BASE_URL = "http://localhost:8000/api/v1"

def run_verification():
    print("--- Phase 5: Result & Profile Verification ---")
    
    # 1. Setup Faculty & 2 Assignments
    fac_email = f"fac_verifier_{uuid.uuid4().hex[:4]}@test.com"
    passw = "SecurePass123!"
    
    requests.post(f"{BASE_URL}/auth/register", json={
        "email": fac_email, "password": passw, "role": "faculty", "first_name": "Pro", "last_name": "Fessor"
    })
    fac_token = requests.post(f"{BASE_URL}/auth/login", json={"email": fac_email, "password": passw}).json()["access_token"]
    
    # Assignment 1: MCQ (Math)
    asn1 = requests.post(f"{BASE_URL}/assignments/", json={
        "title": "Basic Calculus", "description": "Intro quiz", "subject": "Math", "max_marks": 20,
        "questions": [{"type": "MCQ", "question_text": "2+2?", "marks": 20, "correct_answer": {"answer": "4"}}]
    }, headers={"Authorization": f"Bearer {fac_token}"}).json()
    
    # Assignment 2: Descriptive (CS)
    asn2 = requests.post(f"{BASE_URL}/assignments/", json={
        "title": "OS Concepts", "description": "Detailed answers", "subject": "CS", "max_marks": 50,
        "questions": [{"type": "DESCRIPTIVE", "question_text": "Describe a deadlock.", "marks": 50}]
    }, headers={"Authorization": f"Bearer {fac_token}"}).json()
    
    print(f"Assignments Created: {asn1['id']}, {asn2['id']}")

    # 2. Student Submission
    stu_email = f"stu_calc_{uuid.uuid4().hex[:4]}@test.com"
    requests.post(f"{BASE_URL}/auth/register", json={
        "email": stu_email, "password": passw, "role": "student", "first_name": "Math", "last_name": "Whiz"
    })
    stu_login = requests.post(f"{BASE_URL}/auth/login", json={"email": stu_email, "password": passw}).json()
    stu_token = stu_login["access_token"]
    stu_id = stu_login.get("user", {}).get("id")
    
    if not stu_id:
        # Fetch me to get id
        stu_id = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {stu_token}"}).json()["id"]

    print(f"Student Registered: {stu_id}")

    # Submit Correct MCQ
    requests.post(f"{BASE_URL}/submissions/", json={
        "assignment_id": asn1["id"], "answers": {asn1["questions"][0]["id"]: "4"}
    }, headers={"Authorization": f"Bearer {stu_token}"})
    
    # Submit Descriptive
    requests.post(f"{BASE_URL}/submissions/", json={
        "assignment_id": asn2["id"], "answers": {asn2["questions"][0]["id"]: "A deadlock is a situation where two or more processes are blocked forever, waiting for each other to release resources."}
    }, headers={"Authorization": f"Bearer {stu_token}"})

    print("Submissions completed. Waiting for evaluations...")
    time.sleep(1) # Brief wait for database consistency

    # 3. Check Student Report
    report_res = requests.get(f"{BASE_URL}/users/{stu_id}/report", headers={"Authorization": f"Bearer {stu_token}"})
    report = report_res.json()
    
    print("\n--- Student Academic Report ---")
    print(f"Name: {report['name']}")
    print(f"GPA: {report['gpa']}")
    print(f"Total Assignments: {report['total_assignments']}")
    print(f"Average Percentage: {report['average_percentage']}%")
    
    print("\nAssessments:")
    for a in report['assessments']:
        print(f"- {a['name']}: {a['score']}/{a['total']} ({a['percentage']}%) - Feedback: {a['feedback']}")

    # Assertions
    assert report['total_assignments'] == 2
    assert report['gpa'] > 0
    print("\nVerification Successful!")

if __name__ == "__main__":
    run_verification()
