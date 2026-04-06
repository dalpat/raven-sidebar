# Contributing to Raven Sidebar

Thank you for your interest in contributing!

## Ways to Contribute

- 🐛 **Bug Reports** - Report issues on GitHub
- 💡 **Feature Requests** - Suggest new features
- 🔧 **Pull Requests** - Submit code changes
- 📖 **Documentation** - Improve docs

## Development Setup

```bash
# Clone the repository
git clone https://github.com/dalpat/raven-sidebar.git
cd raven-sidebar

# Create a feature branch
git checkout -b feature/your-feature-name
```

## Making Changes

1. Follow the existing code style (ES Modules, GJS patterns)
2. Test your changes locally before submitting
3. Update documentation if needed

## Code Guidelines

- Use ESM imports (not `imports.gi.*`)
- Use `Clutter.Orientation.VERTICAL` instead of deprecated `vertical: true`
- Initialize labels with real text at build time
- Never use silent try/catch - render visible errors in UI

See [CLAUDE.md](CLAUDE.md) for detailed development notes.

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Submit a PR with description of changes

## Contact

- GitHub Issues: https://github.com/dalpat/raven-sidebar/issues
- Email: dalpat@github.com