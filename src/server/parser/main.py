# main.py
import argparse
import importlib
import os
import json

import requests

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--plugin', required=True, help='Plugin name')
    parser.add_argument('--folder', required=True, help='Path to logs folder')
    parser.add_argument('--run-id', required=True, help='Regression run ID')

    args = parser.parse_args()
    url = 'http://localhost:3001/api/upload-regression/json'

    plugin_name = args.plugin
    folder = args.folder
    run_id = args.run_id

    try:
        plugin = importlib.import_module(f'plugins.{plugin_name}')
        parsed_logs = plugin.run(folder)

        num_of_total = len(parsed_logs)
        num_of_failed = sum(1 for log in parsed_logs if log.get('status') == 'FAIL')
        num_of_passed = sum(1 for log in parsed_logs if log.get('status') == 'PASS')
        num_of_unknown = sum(1 for log in parsed_logs if log.get('status') == 'UNKNOWN')

        result = {
            "parsedLogs": parsed_logs,
            "runId": run_id,
            "numOfTotal": num_of_total,
            "numOfFailed": num_of_failed,
            "numOfPassed": num_of_passed,
            "numOfUnknown": num_of_unknown
        }

        try:
            response = requests.post(url, json=result)
            print(response.json())
        except Exception as e:
            print(f'Error uploading result: {e}')
            exit(1)

    except ModuleNotFoundError:
        print(f'Plugin {plugin_name} not found')
        exit(1)
    except AttributeError:
        print(f'Plugin {plugin_name} must define a run(folder, run_id) function')
        exit(1)

if __name__ == '__main__':
    main()
