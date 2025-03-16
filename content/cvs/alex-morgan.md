---
name: Alex Morgan
title: Senior Product Designer
email: alex.morgan@example.com
phone: +1 (555) 123-4567
location: San Francisco, CA
website: https://www.alexmorgan.design
github: https://github.com/alexmorgan
linkedin: https://linkedin.com/in/alexmorgan
bio: Product designer with 8+ years of experience creating user-centered digital experiences for tech startups and established companies. Passionate about accessibility and inclusive design.
defaultAngle: design

# These are inline frontmatter sections that will be parsed
skills:
  - name: Design Tools
    skills:
      - name: Figma
        level: 5
        angles: [design]
      - name: Adobe Creative Suite
        level: 4
        angles: [design]
      - name: Sketch
        level: 4
        angles: [design]
  - name: UX Methodologies
    skills:
      - name: User Experience Design
        level: 5
        angles: [design, research]
      - name: User Research
        level: 4
        angles: [research]
      - name: Prototyping
        level: 4
        angles: [design]
      - name: Design Thinking
        level: 5
        angles: [design, research]
  - name: Technical Skills
    skills:
      - name: HTML/CSS
        level: 3
        angles: [design, tech]
      - name: Design Systems
        level: 5
        angles: [design, tech]
  - name: Specialized Knowledge
    skills:
      - name: Accessibility
        level: 4
        angles: [design, tech]
      - name: Information Architecture
        level: 4
        angles: [design, tech]
      - name: Usability Testing
        level: 4
        angles: [design, tech]

languages:
  - name: English
    proficiency: Native
  - name: Spanish
    proficiency: Professional working proficiency
  - name: French
    proficiency: Elementary proficiency
---

<!--

Procedural Instructions:

- Go through your life from the moment you graduated from school until now
- Identify every period in which you dedicated a significant amount of your time to a consistent goal
- Take these periods and classify them into 'Experience', 'Education' & 'Projects', where:
  - Experience: if the focus of this period was in **application** of knowledge or skills
  - Education: if the focus of this period was in **acquisition** of knowledge or skills
  - Project: if it was  an episode within a larger period dedicated either to **application** or **acquisition** of knowledge or skills; use this for poviding more detailed insights
- While you go through your vita, note down all skills acquired into the frontmatter, without rating the level just yet
- After you finished, subjectively rate your skills among each other:
  - The think you know best is 5 the thing you know least is 1.
  - Don't aim for an objective criterion, keep it subjective.
  - Your rating will have to be nordmed by the reader during interviews or via your overall vita.

Technical Instructions:

- Please conform rather strictly to the format, our parser is intricate and depends on the exact formatting.
- You can try for errors locally with `npm run dev`, otherwise our CI will complain if there's an issue
- Also check the final rendered CV before submitting the PR; create a GitHub issue, if you encounter any problem.

Localization Insttructions:

- When you finished your main language: copy your CV over with a suffix, e.g. `_fr.md` for french
- Then translate all items, including frontmatter values, with exception of (hard-coded keywords):
  - Headers: Experience | Education | Projects
  - Within Projects: List item prefixes 'Technologies:' & 'Link:' - all other free-form prefixes should be translated

-->

## Experience

<!-- Experience is a period in your life where the focus was on **application** of knowledge or skills -->

### {angle=design,tech} Senior Product Designer
TechCorp Inc. | San Francisco, CA | Jan 2020 - Present

- {angle=design} Led designer for flagship product serving 2M+ users, increasing engagement by 34%
- {angle=design} Managed team of 4 designers, implementing design system that reduced design inconsistency by 60%
- {angle=tech} Collaborated with engineering teams to streamline design-to-development handoff, reducing iterations by 40%
- {angle=research} Conducted user research with over 200 participants to identify key pain points

### {angle=design,tech} Product Manager
InnovateLab | Oakland, CA | Mar 2017 - Dec 2019

- {angle=design} Redesigned core user flows resulting in 27% improvement in conversion rate
- {angle=tech} Created responsive designs supporting devices from 320px to 1440px+
- {angle=design} Built interactive prototypes for user testing and presentations
- {angle=tech} Established design guidelines and component library

### {angle=design,research} UI/UX Designer
DesignWorks Agency | Portland, OR | Sep 2015 - Feb 2017

- {angle=design} Designed interfaces for e-commerce, fintech, and healthcare clients
- {angle=research} Conducted usability testing and created user journey maps
- {angle=tech} Collaborated with development team to ensure quality implementation

## Education

<!-- Education is a period in your life where the focus was on **acquisition** of knowledge or skills -->

### {angle=design,research} Master of Fine Arts, Interaction Design
California College of the Arts | San Francisco, CA | 2013 - 2015

- {angle=research} Thesis: "Designing for Behavioral Change in Digital Health Applications"
- Recipient of the Design Excellence Scholarship

### {angle=design} Bachelor of Arts, Graphic Design
University of Oregon | Eugene, OR | 2009 - 2013

- Minor in Psychology
- Design lead for student magazine "Emerge"
- Dean's List, 8 consecutive semesters

## Projects

<!-- Projects are episodes during the above periods in your life focusing on both, acquisition and application of knowledge or skills; this can give readers a more detailed insight abouut you on a specific topic of interest -->

### {angle=design,research} HealthTrack Mobile App (2021)
Redesigned health tracking app focusing on accessibility and habit formation

- Technologies: Figma, Prototyping, User Research
- Link: https://www.alexmorgan.design/healthtrack

### {angle=tech,design} E-commerce Design System (2020)
Created comprehensive component library for e-commerce platform

- Technologies: Design Systems, Documentation
- Link: https://www.alexmorgan.design/ecommerce

### {angle=design,tech} Financial Dashboard (2019)
Designed data visualization dashboard for finance management

- Technologies: Data Visualization, UX Design, Figma
- Link: https://www.alexmorgan.design/fintech
