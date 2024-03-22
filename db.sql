
CREATE DATABASE IF NOT EXISTS social_club;

USE social_club;

CREATE TABLE IF NOT EXISTS Book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
);

INSERT INTO Book (title, description) VALUES ('The Alchemist', 'Past cannot be repeated and everybody has to move forward in life.');
INSERT INTO Book (title, description) VALUES ('Ikigai', 'The Japanese secret to a long and happy life.');
INSERT INTO Book (title, description) VALUES ('The 48 Laws of Power', 'Advice on how to gain and maintain power.');

SELECT * FROM Book;