# Mailer

Mailer is a Node.js application for sending bulk emails using Nodemailer, CSV parsing, and HTML templates. This script reads recipient data from a CSV file, manages email attachments, and tracks sent emails to avoid duplication. Here's an overview of its functionality and setup:

## Features

- **Bulk Email Sending**: Send emails in bulk to recipients listed in a CSV file.
- **Attachment Support**: Include attachments dynamically from a specified directory.
- **Template-based Emails**: Use HTML templates for composing emails with dynamic content.
- **Email Tracking**: Keeps track of sent emails to prevent sending duplicates.
- **Delay Between Emails**: Configurable delay between each email to comply with email service provider limits.

## Installation

To use the Mailer script, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Fedot-Compot/mailer.git
   cd mailer
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```plaintext
   EMAIL=your_email@gmail.com
   PASSWORD=your_email_password
   SENDER_NAME=Your Name
   MAX_EMAILS=100  # Number of maximum emails to send
   WAIT_BETWEEN_MAILS=5  # Wait time in seconds between each email
   ```

   Ensure `subject.txt` and `template.html` files are placed in the `data/` directory. Attachments should also be placed in `data/attachments/` directory.

4. **Run the Script**:

   ```bash
   node index.js
   ```

   This will start sending emails to recipients listed in `data/recipients.csv`.

## Configuration

- **SMTP Configuration**: Modify the `transporter` object in `index.js` to match your SMTP server settings (e.g., host, port, secure mode).
- **Email Content**: Customize `subject.txt` and `template.html` (for base64 you can use [this website](https://codebeautify.org/base64-to-html-converter)) to tailor the subject and body of your emails.

## Notes

- Ensure Node.js and npm are installed on your system before running the script.
- Handle sensitive information like email credentials securely using environment variables.
- Adjust `MAX_EMAILS` and `WAIT_BETWEEN_MAILS` according to your email service provider's sending limits and policies.

## Acknowledgments

- **Nodemailer**: For providing an easy-to-use module for sending emails in Node.js.
- **CSV Parse**: For facilitating the parsing of CSV files in JavaScript.

---

Feel free to extend and customize this script according to your specific requirements. For any issues or feature requests, please open an issue on [GitHub](https://github.com/Fedot-Compot/mailer).
