# n8n-nodes-helpscout

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Help Scout, providing 10 resources and 50+ operations for customer service automation, conversation management, and team collaboration.

![n8n](https://img.shields.io/badge/n8n-community%20node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Help Scout API](https://img.shields.io/badge/Help%20Scout%20API-v2-green)

## Features

- **Full Conversation Management**: Create, read, update, delete conversations with status changes, mailbox transfers, and user assignments
- **Thread Operations**: Add customer threads, reply threads, notes, phone threads, and chat threads with HTML/plain text support
- **Customer Management**: Complete CRUD operations with email, phone, social profiles, and organization linking
- **Organization Support**: Manage company/organization records and their associated conversations
- **Mailbox Operations**: Access mailboxes, folders, and custom fields
- **User Management**: List users, get user details, and retrieve authenticated user information
- **Tag Support**: List and manage conversation tags
- **Workflow Automation**: List workflows and trigger manual workflow runs
- **Comprehensive Reports**: Access company, conversations, productivity, happiness, user, chat, email, and phone reports
- **Webhook Integration**: Full webhook management with signature verification for secure event handling
- **Trigger Node**: Real-time event notifications with automatic webhook lifecycle management

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Search for `n8n-nodes-helpscout`
4. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Clone or extract the package
npm install n8n-nodes-helpscout
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-helpscout.zip
cd n8n-nodes-helpscout

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-helpscout

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-helpscout %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

### OAuth 2.0 (Recommended)

| Field | Description |
|-------|-------------|
| Auth Type | Select `OAuth 2.0` |
| App ID | Your Help Scout OAuth App ID |
| App Secret | Your Help Scout OAuth App Secret |

To obtain OAuth credentials:
1. Log in to Help Scout
2. Go to **Your Profile** > **My Apps**
3. Click **Create My App**
4. Note the App ID and App Secret

### API Key (Legacy)

| Field | Description |
|-------|-------------|
| Auth Type | Select `API Key` |
| API Key | Your Help Scout API Key |

To obtain an API key:
1. Log in to Help Scout
2. Go to **Your Profile** > **Authentication**
3. Generate a new API key

## Resources & Operations

### Conversations

| Operation | Description |
|-----------|-------------|
| Create | Create a new conversation |
| Get | Get a conversation by ID |
| Get All | List all conversations with filters |
| Update | Update conversation properties |
| Delete | Delete a conversation |
| Change Status | Change conversation status (active, pending, closed, spam) |
| Change Mailbox | Move conversation to another mailbox |
| Assign User | Assign conversation to a user |
| Add Tags | Add tags to a conversation |
| Remove Tags | Remove tags from a conversation |
| Get Threads | List all threads in a conversation |

### Threads

| Operation | Description |
|-----------|-------------|
| Create Customer | Add a customer thread |
| Create Reply | Add an agent reply thread |
| Create Note | Add a private note thread |
| Create Phone | Add a phone call thread |
| Create Chat | Add a chat thread |
| Get Source | Get the original thread source |

### Customers

| Operation | Description |
|-----------|-------------|
| Create | Create a new customer |
| Get | Get a customer by ID |
| Get All | List all customers with filters |
| Update | Update customer properties |
| Delete | Delete a customer |
| Get Conversations | List customer's conversations |

### Organizations

| Operation | Description |
|-----------|-------------|
| Create | Create a new organization |
| Get | Get an organization by ID |
| Get All | List all organizations |
| Update | Update organization properties |
| Delete | Delete an organization |
| Get Conversations | List organization's conversations |

### Mailboxes

| Operation | Description |
|-----------|-------------|
| Get | Get a mailbox by ID |
| Get All | List all mailboxes |
| Get Folders | Get mailbox folders |
| Get Fields | Get mailbox custom fields |

### Users

| Operation | Description |
|-----------|-------------|
| Get | Get a user by ID |
| Get All | List all users |
| Get Resource Owner | Get authenticated user |

### Tags

| Operation | Description |
|-----------|-------------|
| Get All | List all tags |

### Workflows

| Operation | Description |
|-----------|-------------|
| Get All | List all workflows |
| Run Manual | Run a manual workflow |

### Reports

| Operation | Description |
|-----------|-------------|
| Get Company | Get company-wide report |
| Get Conversations | Get conversations report |
| Get Productivity | Get productivity report |
| Get Happiness | Get customer happiness report |
| Get User | Get user-specific report |
| Get Chat | Get chat channel report |
| Get Email | Get email channel report |
| Get Phone | Get phone channel report |

### Webhooks

| Operation | Description |
|-----------|-------------|
| Create | Create a new webhook |
| Get All | List all webhooks |
| Update | Update webhook properties |
| Delete | Delete a webhook |

## Trigger Node

The **Help Scout Trigger** node provides real-time event notifications:

### Supported Events

- `convo.created` - Conversation created
- `convo.assigned` - Conversation assigned
- `convo.moved` - Conversation moved to mailbox
- `convo.status` - Conversation status changed
- `convo.tags` - Conversation tags changed
- `convo.customer.reply.created` - Customer reply created
- `convo.agent.reply.created` - Agent reply created
- `convo.note.created` - Note created
- `convo.deleted` - Conversation deleted
- `customer.created` - Customer created
- `satisfaction.ratings` - Satisfaction rating received

### Features

- Automatic webhook registration on workflow activation
- Automatic webhook cleanup on workflow deactivation
- Signature verification for security
- Payload version selection (v1 or v2)

## Usage Examples

### Create a Conversation

```json
{
  "resource": "conversation",
  "operation": "create",
  "mailboxId": "12345",
  "customerEmail": "customer@example.com",
  "subject": "Support Request",
  "text": "Hello, I need help with..."
}
```

### Add a Reply to a Conversation

```json
{
  "resource": "thread",
  "operation": "createReply",
  "conversationId": "67890",
  "text": "<p>Thank you for contacting us!</p>",
  "status": "pending"
}
```

### Get Conversations by Status

```json
{
  "resource": "conversation",
  "operation": "getAll",
  "status": "active",
  "mailboxId": "12345",
  "returnAll": true
}
```

### Create a Customer

```json
{
  "resource": "customer",
  "operation": "create",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567"
}
```

### Get Productivity Report

```json
{
  "resource": "report",
  "operation": "getProductivity",
  "start": "2024-01-01T00:00:00Z",
  "end": "2024-01-31T23:59:59Z",
  "mailboxes": "12345,67890"
}
```

## Help Scout Concepts

### Conversations
Conversations are the primary objects in Help Scout representing customer interactions. Each conversation belongs to a mailbox and contains one or more threads.

### Threads
Threads are individual messages within a conversation. Types include:
- **Customer**: Messages from customers
- **Message/Reply**: Agent responses
- **Note**: Internal notes (not visible to customers)
- **Phone**: Phone call logs
- **Chat**: Chat messages

### Mailboxes
Mailboxes are shared inboxes that organize conversations. Each mailbox can have folders, custom fields, and assigned users.

### Tags
Tags are labels applied to conversations for organization and filtering.

### Workflows
Workflows automate actions based on conversation events. Manual workflows can be triggered via the API.

## Rate Limits

Help Scout API has a rate limit of **400 requests per minute**. The node handles rate limit errors gracefully and will return appropriate error messages when limits are exceeded.

## Error Handling

The node provides detailed error messages for common scenarios:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad request - Invalid parameters |
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not found - Resource doesn't exist |
| 412 | Precondition failed - Policy restriction |
| 429 | Rate limited - Too many requests |
| 500 | Server error - Help Scout issue |

## Security Best Practices

1. **Use OAuth 2.0**: Preferred over API keys for better security
2. **Webhook Secrets**: Always use webhook secrets for signature verification
3. **Credential Storage**: Store credentials securely using n8n's credential system
4. **Least Privilege**: Request only necessary permissions for your integration

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [Help Scout API Docs](https://developer.helpscout.com/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-helpscout/issues)
- **Email**: support@velobpa.com

## Acknowledgments

- [Help Scout](https://www.helpscout.com/) for their excellent customer service platform and API
- [n8n](https://n8n.io/) for the workflow automation platform
- The n8n community for inspiration and support
