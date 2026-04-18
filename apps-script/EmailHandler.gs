/**
 * Binder OS - Demo Request Email Handler
 * Google Apps Script for sending demo request emails to both user and admin
 * 
 * Setup Instructions:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Copy-paste this entire code
 * 4. Deploy as Web App (Deploy > New Deployment > Web app)
 * 5. Set "Execute as" to your Gmail account
 * 6. Set "Who has access" to "Anyone"
 * 7. Copy the deployment URL and add to .env as VITE_GOOGLE_APPS_SCRIPT_URL
 */

// Configuration
const ADMIN_EMAIL = "info@binder33labs.com";
const APP_SCRIPT_EMAIL = "info@binder-os.com"; // The email where this script runs from
const LOGO_URL = "https://binderoslabs.com/logo.png"; // Update with your logo URL

/**
 * Handle POST requests from the form
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const payload = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!payload.email || !payload.name || !payload.companyName) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Missing required fields" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Send emails
    sendUserEmail(payload);
    sendAdminEmail(payload);

    // Log the submission (optional - stores in spreadsheet)
    logSubmission(payload);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Demo request received" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error: " + error);
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Send confirmation email to the user
 */
function sendUserEmail(payload) {
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            padding: 20px;
            line-height: 1.6;
          }
          
          .wrapper {
            max-width: 600px;
            margin: 0 auto;
          }
          
          .container {
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #c0682d 0%, #d47a3d 100%);
            color: white;
            padding: 50px 30px;
            text-align: center;
          }
          
          .header h1 {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 10px;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.95;
          }
          
          .content {
            padding: 40px 30px;
            color: #333333;
          }
          
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #333;
          }
          
          .greeting strong {
            color: #c0682d;
          }
          
          .intro-text {
            font-size: 15px;
            color: #555;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          
          .details-section {
            margin: 30px 0;
          }
          
          .details-box {
            background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%);
            border-left: 4px solid #c0682d;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 15px;
          }
          
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            font-size: 14px;
          }
          
          .detail-label {
            font-weight: 600;
            color: #666;
            min-width: 140px;
          }
          
          .detail-value {
            color: #333;
            text-align: right;
            flex: 1;
            margin-left: 10px;
          }
          
          .what-to-expect {
            background: #f9f9f9;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
            border-top: 3px solid #c0682d;
          }
          
          .what-to-expect h3 {
            font-size: 16px;
            color: #333;
            margin-bottom: 15px;
            font-weight: 600;
          }
          
          .what-to-expect ul {
            list-style: none;
            margin-left: 0;
          }
          
          .what-to-expect li {
            font-size: 14px;
            color: #555;
            margin: 10px 0;
            padding-left: 24px;
            position: relative;
          }
          
          .what-to-expect li:before {
            content: "›";
            position: absolute;
            left: 0;
            color: #c0682d;
            font-size: 20px;
            font-weight: bold;
          }
          
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e0e0e0 50%, transparent 100%);
            margin: 30px 0;
          }
          
          .closing-text {
            font-size: 14px;
            color: #555;
            margin: 20px 0;
            line-height: 1.8;
          }
          
          .signature {
            font-size: 14px;
            color: #333;
            margin-top: 25px;
          }
          
          .signature strong {
            color: #c0682d;
          }
          
          .signature a {
            color: #c0682d;
            text-decoration: none;
            font-weight: 600;
          }
          
          .footer {
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #e0e0e0;
          }
          
          @media only screen and (max-width: 600px) {
            .header {
              padding: 40px 20px;
            }
            
            .header h1 {
              font-size: 24px;
            }
            
            .content {
              padding: 25px 20px;
            }
            
            .detail-row {
              flex-direction: column;
            }
            
            .detail-value {
              text-align: left;
              margin-left: 0;
              margin-top: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Demo Request Confirmed</h1>
              <p>We look forward to showing you Binder OS</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hello <strong>${payload.name}</strong>,</p>
              
              <p class="intro-text">
                Thank you for requesting a demo of Binder OS. We're excited to showcase how our platform can transform your manufacturing operations and streamline your business processes.
              </p>
              
              <div class="details-section">
                <div class="details-box">
                  <div class="detail-row">
                    <span class="detail-label">Scheduled Date & Time</span>
                    <span class="detail-value"><strong>${payload.scheduledDateTime}</strong></span>
                  </div>
                </div>
                
                <div class="details-box">
                  <div class="detail-row">
                    <span class="detail-label">Organization</span>
                    <span class="detail-value">${payload.companyName}</span>
                  </div>
                </div>
                
                <div class="details-box">
                  <div class="detail-row">
                    <span class="detail-label">Email Address</span>
                    <span class="detail-value">${payload.email}</span>
                  </div>
                </div>
                
                <div class="details-box">
                  <div class="detail-row">
                    <span class="detail-label">Phone Number</span>
                    <span class="detail-value">${payload.phone}</span>
                  </div>
                </div>
              </div>
              
              <p class="intro-text">
                Our team will reach out to you at the contact information provided to confirm your demo session and discuss your specific needs.
              </p>
              
              <div class="what-to-expect">
                <h3>What to Expect During Your Demo</h3>
                <ul>
                  <li>Overview of Binder OS platform capabilities and features</li>
                  <li>Live walkthrough tailored to your manufacturing workflow</li>
                  <li>Interactive Q&A session with our product specialists</li>
                  <li>Discussion of implementation timeline and next steps</li>
                </ul>
              </div>
              
              <div class="divider"></div>
              
              <p class="closing-text">
                If you need to reschedule your demo or have any questions before our meeting, please feel free to reply to this email or contact us directly at support@binderoslabs.com.
              </p>
              
              <p class="signature">
                Best regards,<br>
                <strong>The Binder OS Team</strong><br>
                <a href="https://binderoslabs.com">www.binderoslabs.com</a>
              </p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply with attachments. For inquiries, contact support@binderoslabs.com</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    GmailApp.sendEmail(
      payload.email,
      "Demo Request Confirmed - Binder OS",
      `Demo Request Confirmed\n\nHello ${payload.name},\n\nThank you for requesting a demo of Binder OS.\n\nScheduled Date & Time: ${payload.scheduledDateTime}\nOrganization: ${payload.companyName}\n\nOur team will reach out shortly to confirm and discuss your needs.\n\nBest regards,\nThe Binder OS Team\n\nwww.binderoslabs.com`,
      {
        htmlBody: emailTemplate,
        from: APP_SCRIPT_EMAIL,
        replyTo: ADMIN_EMAIL,
      }
    );
  } catch (error) {
    Logger.log("Error sending user email: " + error);
  }
}

/**
 * Send notification email to admin
 */
function sendAdminEmail(payload) {
  const adminTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            padding: 20px;
          }
          
          .wrapper {
            max-width: 600px;
            margin: 0 auto;
          }
          
          .container {
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #c0682d 0%, #d47a3d 100%);
            color: white;
            padding: 40px 30px;
          }
          
          .badge {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            text-transform: uppercase;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
          }
          
          .content {
            padding: 35px 30px;
            color: #333;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 0 0 25px 0;
          }
          
          .info-box {
            background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%);
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid #c0682d;
          }
          
          .info-label {
            font-size: 11px;
            color: #999;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          
          .info-value {
            font-size: 14px;
            color: #333;
            font-weight: 500;
            word-break: break-word;
          }
          
          .purpose-section {
            background: linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%);
            padding: 20px;
            border-radius: 8px;
            border-left: 3px solid #c0682d;
            margin: 25px 0;
          }
          
          .purpose-section .info-label {
            margin-bottom: 12px;
          }
          
          .purpose-content {
            font-size: 14px;
            color: #333;
            line-height: 1.6;
            background-color: #ffffff;
            padding: 12px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
          }
          
          .next-steps {
            background-color: #f0f7ff;
            border-left: 3px solid #2E6B85;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
          }
          
          .next-steps h3 {
            font-size: 14px;
            color: #2E6B85;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          .next-steps ul {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          
          .next-steps li {
            font-size: 13px;
            color: #333;
            margin: 8px 0;
            padding-left: 20px;
            position: relative;
          }
          
          .next-steps li:before {
            content: "›";
            position: absolute;
            left: 0;
            color: #c0682d;
            font-size: 18px;
            font-weight: bold;
          }
          
          .footer {
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            padding: 20px 30px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #999;
          }
          
          .footer-item {
            margin: 8px 0;
          }
          
          .request-id {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            background-color: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            color: #666;
          }
          
          @media only screen and (max-width: 600px) {
            .info-grid {
              grid-template-columns: 1fr;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .content {
              padding: 20px;
            }
            
            .header h1 {
              font-size: 22px;
            }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="badge">New Lead</div>
              <h1>Demo Request Received</h1>
            </div>
            
            <div class="content">
              <div class="info-grid">
                <div class="info-box">
                  <div class="info-label">Full Name</div>
                  <div class="info-value">${payload.name}</div>
                </div>
                <div class="info-box">
                  <div class="info-label">Organization</div>
                  <div class="info-value">${payload.companyName}</div>
                </div>
                <div class="info-box">
                  <div class="info-label">Email Address</div>
                  <div class="info-value">${payload.email}</div>
                </div>
                <div class="info-box">
                  <div class="info-label">Phone Number</div>
                  <div class="info-value">${payload.phone}</div>
                </div>
                <div class="info-box">
                  <div class="info-label">Scheduled Date & Time</div>
                  <div class="info-value">${payload.scheduledDateTime}</div>
                </div>
                <div class="info-box">
                  <div class="info-label">Request ID</div>
                  <div class="info-value"><span class="request-id">${generateRequestId()}</span></div>
                </div>
              </div>
              
              <div class="purpose-section">
                <div class="info-label">Prospect Message</div>
                <div class="purpose-content">${payload.purpose}</div>
              </div>
              
              <div class="next-steps">
                <h3>Recommended Actions</h3>
                <ul>
                  <li>Add prospect to CRM system as new qualified lead</li>
                  <li>Prepare personalized demo materials based on their needs</li>
                  <li>Send pre-demo information and agenda</li>
                  <li>Confirm demo slot and send calendar invite</li>
                  <li>Document outcome and follow-up timeline</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-item">Submitted: ${new Date(payload.submittedAt).toLocaleString()}</div>
              <div class="footer-item">Source: Binder OS Website - Demo Request Form</div>
              <div class="footer-item">Contact: support@binderoslabs.com</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    GmailApp.sendEmail(
      ADMIN_EMAIL,
      `[NEW LEAD] Demo Request from ${payload.name} - ${payload.companyName}`,
      `New Demo Request\n\nName: ${payload.name}\nOrganization: ${payload.companyName}\nEmail: ${payload.email}\nPhone: ${payload.phone}\n\nScheduled Date & Time: ${payload.scheduledDateTime}\n\nMessage:\n${payload.purpose}\n\nRequest ID: ${generateRequestId()}\nSubmitted: ${new Date(payload.submittedAt).toLocaleString()}`,
      {
        htmlBody: adminTemplate,
        from: APP_SCRIPT_EMAIL,
      }
    );
  } catch (error) {
    Logger.log("Error sending admin email: " + error);
  }
}

/**
 * Log submissions to a Google Sheet for tracking
 */
function logSubmission(payload) {
  try {
    // Get the active spreadsheet (create one if needed)
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
    
    if (!spreadsheetId) {
      Logger.log("No spreadsheet configured for logging");
      return;
    }

    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Organization",
        "Email",
        "Phone",
        "Scheduled Date/Time",
        "Message",
        "Status",
        "Request ID"
      ]);
    }

    // Add data row
    sheet.appendRow([
      new Date(),
      payload.name,
      payload.companyName,
      payload.email,
      payload.phone,
      payload.scheduledDateTime,
      payload.purpose,
      "New",
      generateRequestId()
    ]);
  } catch (error) {
    Logger.log("Error logging submission: " + error);
  }
}

/**
 * Generate unique request ID
 */
function generateRequestId() {
  return "REQ-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

/**
 * Setup function - run this once to initialize
 */
function setupScript() {
  Logger.log("Script setup complete!");
  Logger.log("Configuration:");
  Logger.log("- Admin Email: " + ADMIN_EMAIL);
  Logger.log("- App Script Email: " + APP_SCRIPT_EMAIL);
  Logger.log("\nNext steps:");
  Logger.log("1. Deploy this as Web App");
  Logger.log("2. Copy the deployment URL to your .env file as VITE_GOOGLE_APPS_SCRIPT_URL");
  Logger.log("3. Test with the form on your website");
}
