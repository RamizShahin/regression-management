# main.py
import argparse
import importlib
import os
import json

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--plugin', required=True, help='Plugin name')
    parser.add_argument('--folder', required=True, help='Path to logs folder')
    parser.add_argument('--run-id', required=True, help='Regression run ID')

    args = parser.parse_args()

    plugin_name = args.plugin
    folder = args.folder
    run_id = args.run_id

    try:
        plugin = importlib.import_module(f'plugins.{plugin_name}')
        parsed_logs = plugin.run(folder)

        for log in parsed_logs:
            print(json.dumps(log, indent=2))
    except ModuleNotFoundError:
        print(f'Plugin {plugin_name} not found')
        exit(1)
    except AttributeError:
        print(f'Plugin {plugin_name} must define a run(folder, run_id) function')
        exit(1)

if __name__ == '__main__':
    main()
