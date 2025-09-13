-- Remove test users to clean up database for email flow testing
DELETE FROM profiles WHERE email IN ('abubakarsa242@gmail.com', 'lilsadiq7@gmail.com', 'lilsadiq79@gmail.com', 'abubakar.abdulrazak@circuitpointe.com');

DELETE FROM auth.users WHERE email IN ('abubakarsa242@gmail.com', 'lilsadiq7@gmail.com', 'lilsadiq79@gmail.com', 'abubakar.abdulrazak@circuitpointe.com');