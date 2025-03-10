# Vitae

Open-source platform for creating and sharing professional resumes. Contribute your own CV template through GitHub.

## Development

```bash
# Clone and install
git clone https://github.com/VitaHub-App/vitae.git
cd vitae
npm install
npm run dev
```

## Workflow
- Edit locally or via GitHub web editor
- Submit changes through PRs
- Use standard Git workflow

## Contribute Your CV

1. **Create your template**:
```bash
gh repo fork VitaHub-App/vitae --clone
cd vitae
git checkout -b feat/add-<your-name>-cv
cp ./contents/cvs/alex-morgan.md ./contents/cvs/<your-name>.md
```

2. **Edit and submit**:
```bash
# Edit your markdown file then
git add . && git commit -m "Add <your-name> CV"
git push -u origin HEAD
gh pr create --fill
```

## Governance

- Use GitHub issues for feature requests
- React with 👍 on issues that you'd like to see prioritized
