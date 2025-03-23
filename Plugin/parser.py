import json
import os
import glob


def parse_logs(file_path, project, component):
    with open(file_path, 'r') as file:
        lines = file.readlines()
    errors_count = 0
    warn_count = 0
    error_level = []
    status = 'UNKOWN'
    # Extract the log file info
    data = {
        "test_name": lines[0].split(": ", 1)[1].strip().strip('""'),
        "test_command": lines[1].split(": ", 1)[1].strip(),
        "date": lines[2].split(": ", 1)[1].strip(),
        "component": component,
        "module": lines[3].split(": ", 1)[1].strip(),
        "project": project,
        "owner": lines[4].split(": ", 1)[1].strip(),
        "summary": []
    }

    # Process log lines (starting from line 6)
    messages = []
    for line in lines[5:]:
        message = ''
        line = line.strip()
        # to skip the empty lines
        if not line:
            continue

        first_bracket = line.find("[")
        last_bracket = line.find("]")
        if first_bracket == -1 or last_bracket == -1:
            continue  # Skip malformed lines

        # Extracting the log level and the message
        remaining_part = line[last_bracket + 2:].split(" ", 1)
        if len(remaining_part) < 2:
            continue  # Skip malformed lines

        level = remaining_part[0]
        if 'ERROR' in level:
            errors_count += 1
            message = remaining_part[1].strip()
            messages.append(message)
            error_level.append('ERROR')

        elif 'FATAL' in level:
            errors_count += 1
            error_level.append('FATAL')
            message = remaining_part[1].split(" ", 1)[1].strip()
            messages.append(message)

        elif 'UNKNOWN' in level:
            errors_count += 1
            error_level.append('UNKNOWN')
            message = remaining_part[1].split(" ", 1)[1].strip()
            messages.append(message)

        elif 'WARN' in level:
            warn_count += 1

        # to extract the status of the test
        if 'pass' in level.lower():
            status = 'PASS'
        elif 'fail' in level.lower():
            status = 'FAIL'
    if status == None:
        status = 'UNKNOWN'
    log_entry = {
        "test_status": status,
        "errors_count": errors_count,
        "warnings_count": warn_count,
        "error_level": error_level,
        "identified_issues": messages,
    }

    data["summary"].append(log_entry)

    return data

def save_as_json(data, output_file):
    with open(output_file, 'w') as json_file:
        json.dump(data, json_file, indent=4)


def process_logs_in_folder(folder_path):
    project_name = folder_path.split("\\")[-1]
    # Walk through the directory tree and find all .txt log files
    for root, dirs, files in os.walk(folder_path):
        # to skip the project structure.txt file
        if 'project structure.txt' in files and root == folder_path:
            files.remove('project structure.txt')
        component = os.path.basename(root)
        for file in files:
            if file.endswith(".txt"):
                input_file = os.path.join(root, file)
                component = input_file.split("\\")[-1].split(".")[0]
                output_file = os.path.splitext(input_file)[0] + ".json"

                # Parse the log file and save as JSON
                parsed_data = parse_logs(input_file, project_name, component)
                save_as_json(parsed_data, output_file)
                print(f"Logs from '{input_file}' have been parsed and saved to '{output_file}'")




if __name__ == "__main__":
    folder_path = "C:\\Users\\hp\\Downloads\\Retail Management System"
    process_logs_in_folder(folder_path)
