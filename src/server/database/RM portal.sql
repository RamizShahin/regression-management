CREATE TABLE `users` (
  `user_id` INT PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `role` ENUM('admin', 'manager', 'user') DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `projects` (
  `project_id` INT PRIMARY KEY,
  `project_name` VARCHAR(255),
  `project_description` TEXT
);

CREATE TABLE `user_project` (
  `id` INT PRIMARY KEY,
  `user_id` INT,
  `project_id` INT,
  `role` ENUM ('manager', 'developer', 'tester')
);

CREATE TABLE `modules` (
  `module_id` INT PRIMARY KEY,
  `module_name` VARCHAR(255),
  `project_id` INT
);

CREATE TABLE `components` (
  `component_id` INT PRIMARY KEY,
  `component_name` VARCHAR(255),
  `module_id` INT,
  `owner_id` INT
);

CREATE TABLE `regression_runs` (
  `run_id` INT PRIMARY KEY,
  `project_id` INT,
  `execution_date` DATETIME,
  `total_tests` INT,
  `passed` INT,
  `failed` INT,
  `unknown` INT
);

CREATE TABLE `test_cases` (
  `test_id` INT PRIMARY KEY,
  `run_id` INT,
  `component_id` INT,
  `test_name` VARCHAR(255),
  `status` ENUM ('passed', 'failed', 'unknown'),
  `owner_id` INT
);

CREATE TABLE `logs` (
  `log_id` INT PRIMARY KEY,
  `run_id` INT,
  `file_name` VARCHAR(255),
  `file_path` TEXT
);

CREATE TABLE `errors` (
  `error_id` int PRIMARY KEY AUTO_INCREMENT,
  `test_id` int,
  `error_message` text
);

CREATE TABLE refresh_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

ALTER TABLE `user_project` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `user_project` ADD FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`);

ALTER TABLE `modules` ADD FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`);

ALTER TABLE `components` ADD FOREIGN KEY (`module_id`) REFERENCES `modules` (`module_id`);

ALTER TABLE `components` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `regression_runs` ADD FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`);

ALTER TABLE `test_cases` ADD FOREIGN KEY (`run_id`) REFERENCES `regression_runs` (`run_id`);

ALTER TABLE `test_cases` ADD FOREIGN KEY (`component_id`) REFERENCES `components` (`component_id`);

ALTER TABLE `test_cases` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `logs` ADD FOREIGN KEY (`run_id`) REFERENCES `regression_runs` (`run_id`);

ALTER TABLE `errors` ADD FOREIGN KEY (`test_id`) REFERENCES `test_cases` (`test_id`);

ALTER TABLE `refresh_tokens` ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
