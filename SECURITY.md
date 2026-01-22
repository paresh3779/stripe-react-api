# 🔒 Security Guidelines

## ⚠️ CRITICAL: Before Starting Development

This project contains **SENSITIVE CONFIGURATION** that must **NEVER** be committed to GitHub.

---

## 📋 Required Setup for New Developers

### 1. Environment Configuration

**You will receive the following files separately from the project lead:**
- `.env` - Local environment variables
- Database credentials
- JWT secret keys
- API keys (Stripe, AWS, etc.)

**NEVER commit these files to Git!** They are already in `.gitignore`.

### 2. Initial Setup Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd stripe-react-api

# 2. Install dependencies
npm install

# 3. Contact project lead for environment files
# - Request .env file with all credentials
# - Place it in the project root

# 4. Verify .env exists and contains:
# - DATABASE_URL
# - JWT_SECRET
# - JWT_REFRESH_SECRET
# - STRIPE_SECRET_KEY (if applicable)
# - Other API keys

# 5. Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# 6. Start development
npm run dev
```

---

## 🚫 Files That Must NEVER Be Committed

### Environment Variables
- ✅ `.env.example` - Template (SAFE to commit)
- ❌ `.env` - Actual credentials (NEVER commit)
- ❌ `.env.local` - Local overrides (NEVER commit)
- ❌ `.env.development` - Dev credentials (NEVER commit)
- ❌ `.env.production` - Production credentials (NEVER commit)

### Credentials & Keys
- ❌ SSL certificates (`*.pem`, `*.key`, `*.crt`)
- ❌ SSH keys (`id_rsa`, `*.ppk`)
- ❌ API key files (`secrets.json`, `credentials.json`)
- ❌ Database dumps (`*.sql`, `*.dump`)
- ❌ Stripe configuration files (`stripe_*.json`)

---

## 📝 Creating Your .env File

**Template (.env.example):**
```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=/api

# Database
DATABASE_URL="mysql://root@127.0.0.1:3306/stripe_react_demo"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3001

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Steps:**
1. Copy `.env.example` to `.env`
2. Replace placeholder values with actual credentials
3. **NEVER commit the `.env` file**

---

## ✅ Pre-Commit Checklist

Before committing code, verify:

- [ ] `.env` is listed in `.gitignore`
- [ ] No API keys in code comments
- [ ] No hardcoded passwords or secrets
- [ ] No database credentials in files
- [ ] No Stripe test/live keys in code
- [ ] Run `git status` - ensure no `.env` files staged
- [ ] Check `git diff` for accidental secrets

### Verify Before Push
```bash
# Check what files are staged
git status

# If you see .env or similar files, STOP!
git reset .env

# Always review changes
git diff --staged
```

---

## 🔐 Security Best Practices

### For Developers
1. **Use Strong Secrets**: Generate random 32+ character secrets for JWT
2. **Rotate Keys**: Change secrets periodically
3. **Separate Environments**: Different keys for dev/staging/production
4. **Use Environment Variables**: Never hardcode credentials
5. **Review Pull Requests**: Check for accidentally committed secrets

### For Project Leads
1. **Share Credentials Securely**: Use password managers or secure channels
2. **Document Requirements**: List all required environment variables
3. **Access Control**: Limit production access
4. **Audit Logs**: Monitor who accesses sensitive data
5. **Incident Response**: Have a plan if keys are exposed

---

## 🚨 If Credentials Are Accidentally Committed

### Immediate Actions:

1. **Rotate ALL exposed credentials immediately**
   - Change database passwords
   - Regenerate JWT secrets
   - Rotate API keys
   - Revoke Stripe keys

2. **Remove from Git history**
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # Contact project lead for assistance
   ```

3. **Notify team members**
4. **Update all environments**

---

## 📞 Contact

If you need access to credentials or have security concerns:
- **Project Lead**: [Contact Information]
- **DevOps Team**: [Contact Information]

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Git Secret Management](https://git-secret.io/)
- [Environment Variable Best Practices](https://12factor.net/config)
