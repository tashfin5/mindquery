-- PostgreSQL formatted data restore script
-- Run this in your Vercel Postgres Query editor to restore your questions and results!

INSERT INTO questions (id, question, choices, correct_index, created_at) VALUES
(16, 'Which language is primarily used to structure web pages?', '["JavaScript","HTML","PHP","Python"]', 1, '2025-12-10 21:49:52'),
(17, 'Which tag is used to link an external CSS file?', '["<style>","<css>","<link>","<script>"]', 2, '2025-12-10 21:51:56'),
(18, 'Which of the following is a JavaScript framework?', '["Django","Flask","React","Laravel"]', 2, '2025-12-10 21:52:20'),
(19, 'What does CSS stand for?', '["Computer Style Sheets","Cascading Style Sheets","Custom Styling System","Creative Style Scripts"]', 1, '2025-12-10 21:52:58'),
(20, 'Which HTTP method is typically used to submit form data?', '["GET","POST","PUT","DELETE"]', 1, '2025-12-10 21:53:29'),
(21, 'Which symbol is used for single-line comments in JavaScript?', '["//","<!-- -->","##","/** */"]', 0, '2025-12-10 21:54:11'),
(22, 'Inside which tag do we write JavaScript code?', '["<script>","<javascript>","<code>","<js>"]', 0, '2025-12-10 21:54:28'),
(23, 'Which of the following is NOT a backend language?', '["Node.js","PHP","Ruby","CSS"]', 3, '2025-12-10 21:54:43'),
(24, 'Which attribute specifies the URL an anchor tag points to?', '["src","href","link","url"]', 1, '2025-12-10 21:55:04'),
(25, 'What does DOM stand for?', '["Document Object Model","Data Object Management","Desktop Order Module","Digital Overview Map"]', 0, '2025-12-10 21:55:56'),
(26, 'Which protocol is used for secure communication on the web?', '["FTP","HTTP","HTTPS","SMTP"]', 2, '2025-12-10 21:56:09'),
(27, 'Which HTML element is used to display an image?', '["<pic>","<img>","<image>","<src>"]', 1, '2025-12-10 21:56:27'),
(28, 'Which database is commonly used with PHP?', '["MongoDB","Firebase","MySQL","Oracle Cloud"]', 2, '2025-12-10 21:56:52'),
(29, 'Which HTML tag is used for creating a table row?', '["<td>","<tr>","<row>","<table-row>"]', 1, '2025-12-10 21:57:11'),
(30, 'Which JavaScript method is used to select an element by ID?', '["getElementByClass()","querySelectorAll()","getElementById()","selectById()"]', 2, '2025-12-10 21:57:26'),
(31, 'Which property in CSS controls text size?', '["font-weight","text-style","font-size","size"]', 2, '2025-12-10 21:58:03'),
(32, 'Which tag is used to create a numbered list in HTML?', '["<ul>","<ol>","<li>","<list>"]', 1, '2025-12-10 21:58:30'),
(33, 'PHP files typically have which extension?', '[".ph",".html",".php",".js"]', 2, '2025-12-10 21:58:37'),
(34, 'JSON stands for?', '["Java Syntax Object Notation","JavaScript Object Notation","Java Source Object Node","Joined Script Output Network"]', 1, '2025-12-10 21:59:03'),
(35, 'Which of the following is used for styling HTML elements?', '["SQL","PHP","CSS","JSON"]', 2, '2025-12-10 21:59:38'),
(37, 'Which declaration MUST be the very first thing in an HTML5 document?', '["<html>","<!DOCTYPE html>","<head>","<title>"]', 1, '2025-12-17 14:14:38'),
(38, 'What is the correct HTML element for the largest heading?', '["<head>","<h6>","<h1>","<header>"]', 2, '2025-12-17 14:16:15'),
(39, 'Which JavaScript keyword is used to declare a variable that cannot be reassigned?', '["var","let","const","static"]', 2, '2025-12-17 14:17:14'),
(40, 'What does HTTP status code 404 represent?', '["Success","Internal Server Error","Not Found","Forbidden"]', 2, '2025-12-17 14:18:25'),
(41, 'Which HTML tag is used to create a line break?', '["<br>","<lb>","<break>","<newline>"]', 0, '2025-12-17 14:19:41'),
(42, 'Which CSS property is used to change the text color of an element?', '["text-color","font-color","background-color","color"]', 3, '2025-12-17 14:21:25'),
(43, 'Which operator is used for "strict equality" (value and type) in JavaScript?', '["===","!=","=","=="]', 0, '2025-12-17 14:22:35'),
(44, 'Which CSS property controls the space inside the border of an element?', '["margin","border-spacing","padding","spacing"]', 2, '2025-12-17 14:23:58'),
(45, 'Which HTML input attribute specifies a short hint that describes the expected value?', '["value","placeholder","title","hint"]', 1, '2025-12-17 14:24:57'),
(46, 'What does SQL stand for?', '["Standard Query Language","System Query Logic","Simple Question Language","Structured Query Language"]', 3, '2025-12-17 14:26:24'),
(47, 'Which built-in JavaScript function is used to print messages to the browser console?', '["print()","alert()","log.console()","console.log()"]', 3, '2025-12-17 14:27:37'),
(48, 'Which CSS property is used to make text bold?', '["font-style","text-decoration","font-weight","text-align"]', 2, '2025-12-17 14:28:52'),
(49, 'Which HTML tag is used to define a cell in a table?', '["<tc>","<td>","<cell>","<table>"]', 1, '2025-12-17 14:30:08'),
(50, 'In PHP, all variables must start with which symbol?', '["$","@","!","%"]', 0, '2025-12-17 14:31:07'),
(51, 'Which JavaScript event occurs when a user clicks on an HTML element?', '["onchange","onclick","onmouse","onhover"]', 1, '2025-12-17 14:33:07'),
(52, 'What is the purpose of the <meta name="viewport"> tag?', '["To set the page title","To link CSS files","To make the website responsive on mobile devices","To include JavaScript"]', 2, '2025-12-17 14:35:27'),
(53, 'Which CSS property allows you to hide an element but keep its space in the layout?', '["display: none","visibility: hidden","opacity: 0","background: transparent"]', 1, '2025-12-17 14:37:37'),
(54, 'Which symbol is used to select an element by ID in CSS?', '[".","@","#","*"]', 2, '2025-12-17 14:39:16'),
(55, 'What is the default display value of a <div> element?', '["inline","block","flex","inline-block"]', 1, '2025-12-17 14:40:33'),
(56, 'Which JavaScript method converts a JSON string into a JavaScript object?', '["JSON.stringify()","JSON.parse()","JSON.toObject()","JSON.convert()"]', 1, '2025-12-17 14:41:32');

-- Update the sequence so new questions don't get duplicate IDs
SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));

INSERT INTO results (id, username, total, time_taken, score, created_at) VALUES
(21, 'Miftahul Islam Tashfin', 20, 158, 15, '2025-12-10 22:02:42'),
(22, 'Finn', 20, 107, 16, '2025-12-10 22:06:20'),
(23, 'Nipu Basher', 20, 294, 13, '2025-12-10 22:08:42'),
(24, 'Irfan', 20, 232, 16, '2025-12-10 22:12:56'),
(26, 'Saif Abrar', 20, 196, 19, '2025-12-10 22:59:24'),
(28, 'Asif', 20, 19, 8, '2025-12-11 08:23:10'),
(29, 'Zarir', 20, 251, 12, '2025-12-11 15:55:14'),
(30, 'Tashfin', 20, 64, 15, '2025-12-11 18:27:58'),
(31, 'Ovi', 20, 73, 15, '2025-12-13 19:24:07'),
(32, 'zohaer', 20, 68, 2, '2025-12-13 20:06:01'),
(33, 'Tashfin', 20, 52, 3, '2025-12-14 07:40:09'),
(34, 'Rahman', 20, 43, 5, '2025-12-14 08:14:34'),
(35, 'Zunayed', 20, 17, 4, '2025-12-14 11:13:27'),
(36, 'Hamim', 20, 269, 15, '2025-12-17 13:59:30'),
(37, 'Nipu Basher', 20, 49, 2, '2025-12-17 14:55:17');

-- Update the sequence so new results don't get duplicate IDs
SELECT setval('results_id_seq', (SELECT MAX(id) FROM results));
