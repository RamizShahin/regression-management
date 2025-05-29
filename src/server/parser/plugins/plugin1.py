# plugins/plugin1.py

def run(folder: str, run_id: str):
    print(f"Running plugin1 on folder: {folder}, run ID: {run_id}")
    # Add your parsing logic here
    # Extract test name, status, etc.
    # Insert into MySQL using pymysql, sqlalchemy, etc.
