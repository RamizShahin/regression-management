import json
import re
from pathlib import Path

def parse_log_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    def extract(pattern, default=''):
        match = re.search(pattern, content, re.MULTILINE)
        return match.group(1).strip() if match else default

    test_name = extract(r'Test Name:\s*"([^"]+)"')
    test_command = extract(r'Command:\s*(.+)')
    owner = extract(r'Owner:\s*(.+)')
    module = extract(r'Module:\s*(.+)')
    component = Path(file_path).stem
    status_match = re.search(r'^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+\]\s+(PASS|FAIL|UNKNOWN)\b', content, re.MULTILINE)
    status = status_match.group(1) if status_match else 'UNKNOWN'


    # Summary parsing
    error_lines = re.findall(r'^\[.*?\]\s+ERROR\b.*', content, re.MULTILINE)
    num_errors = len(error_lines)
    warning_lines = re.findall(r'^\[.*?\]\s+WARN(?:ING)?\b.*', content, re.MULTILINE)
    num_warnings = len(warning_lines)

    # Extract error list
    info_error_blocks = re.findall(
        r"INFO\s+'.+?'.*?:\n((?:\s+- .+\n?)*)",
        content,
        re.MULTILINE | re.IGNORECASE
    )

    identified_errors = []
    for block in info_error_blocks:
        identified_errors.extend(re.findall(r'- (.+)', block.strip()))

    # print("hi")

    return {
        "test_name": test_name,
        "test_command": test_command,
        "owner": owner,
        "status": status,
        "module": module,
        "component": component,
        "summary": {
            "errors": num_errors,
            "warnings": num_warnings,
            "identified_errors": identified_errors
        }
    }

extracted_files = "C:/Users/ramiz/Desktop/this semester/seminar/log files examples/Healthcare Management System/Billing"

def run(folder):
    # Apply parser to all files under the specified directory
    log_files = Path(folder).rglob('*.txt')
    parsed_logs = []
    for log_file in log_files:
        # print(f"Parsing file: {log_file}")
        parsed_log = parse_log_file(log_file)
        parsed_logs.append(parsed_log)

    return parsed_logs