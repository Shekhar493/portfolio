# Chandra Shekhar Yadav - Portfolio Website

A modern, fully responsive portfolio website built with HTML5, CSS3, and JavaScript. Features a glassmorphism design, smooth animations, dark theme, and interactive elements.

## 📁 Files Included

- **index.html** - Main HTML structure
- **style.css** - Complete styling with animations and responsive design
- **script.js** - JavaScript for interactivity and animations
- **profile.jpg** - Your profile image (needs to be added)

## 🚀 Getting Started

1. **Download all files** and place them in the same folder
2. **Add your profile image**:
   - Replace `profile.jpg` with your actual profile photo
   - Keep the filename as `profile.jpg` or update the reference in `index.html`
3. **Open in browser**: Double-click `index.html` or right-click → "Open with" → Your browser

## 🎨 Features

✨ **Modern Design**
- Glassmorphism effect
- Neumorphic shadows
- Dark theme (easy to customize)
- Smooth animations and transitions

🎯 **Interactive Elements**
- Animated cursor follower
- Smooth scroll navigation
- Hover effects on cards
- Form validation with feedback
- Back-to-top button
- Mobile-responsive menu

📱 **Fully Responsive**
- Desktop, tablet, and mobile optimized
- Hamburger menu for mobile
- Flexible grid layouts

## 🛠️ Customization Guide

### Change Your Name & Title
In `index.html`, find the hero section:
```html
<h1 class="reveal-delay-1">Chandra Shekhar <span>Yadav</span></h1>
<p class="reveal-delay-2">Your professional title or description here</p>
```

### Update About Section
Find the about section and modify:
```html
<p>I am a dedicated and passionate coder...</p>
```

### Add More Skills
In the skills section, duplicate a skill card:
```html
<div class="skill-card">
    <div class="skill-icon"><i class="fas fa-code"></i></div>
    <h3>Your Skill Name</h3>
</div>
```

[Available icons at: https://fontawesome.com/icons]

### Add More Projects
Duplicate a project card in the projects section:
```html
<div class="project-card">
    <div class="project-image">
        <i class="fas fa-laptop-code"></i>
    </div>
    <div class="project-info">
        <h3>Your Project Title</h3>
        <p>Your project description</p>
        <div class="project-tags">
            <span>Technology 1</span>
            <span>Technology 2</span>
        </div>
        <a href="your-link" class="btn-text">View Project →</a>
    </div>
</div>
```

### Update Social Links
Find the social links section and update URLs:
```html
<a href="https://your-facebook-url" target="_blank" title="Facebook">
    <i class="fab fa-facebook-f"></i>
</a>
```

### Change Colors
In `style.css`, modify the CSS variables at the top:
```css
:root {
    --primary-color: #ff3e3e;      /* Main accent color */
    --primary-hover: #ff1a1a;      /* Hover color */
    --bg-color: #121212;           /* Background color */
    --text-color: #e0e0e0;         /* Text color */
}
```

### Change Font
Replace Google Fonts link in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap" rel="stylesheet">
```

## 📧 Contact Form Setup

The contact form currently logs data to console. To actually send emails, you have several options:

### Option 1: FormSubmit (Free & Easy)
1. Sign up at [formsubmit.co](https://formsubmit.co)
2. Update the form action in `index.html`:
```html
<form class="contact-form" action="https://formsubmit.co/your-email@example.com" method="POST">
```

### Option 2: Netlify Forms (If hosting on Netlify)
Add `netlify` attribute to form:
```html
<form class="contact-form" name="contact" method="POST" netlify>
```

### Option 3: Backend Service
Connect to a backend API that handles email sending.

## 🌐 Deployment Options

### GitHub Pages (Free)
1. Create a GitHub repository
2. Upload your files
3. Go to Settings → Pages → Deploy from main branch

### Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your folder
3. Your site goes live instantly

### Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Import your project
3. Deploy with one click

### Traditional Hosting
1. Get a domain and hosting
2. Upload files via FTP
3. Access your portfolio online

## 🎯 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Tips & Best Practices

1. **Profile Image**: Use a high-quality, professional headshot (square, 380x380px)
2. **SEO**: Update the `<title>` tag with relevant keywords
3. **Performance**: Optimize images before uploading
4. **Mobile Testing**: Test on actual devices or use browser dev tools
5. **Regular Updates**: Keep your portfolio fresh with new projects

## 🎨 Icon Resources

- **Font Awesome**: https://fontawesome.com
- **Feather Icons**: https://feathericons.com
- **Material Icons**: https://fonts.google.com/icons

## 🔧 Troubleshooting

### Profile image not showing
- Check if `profile.jpg` is in the same folder as `index.html`
- Verify the filename matches exactly (case-sensitive on Linux/Mac)

### Styling looks broken
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Make sure all files are in the same folder
- Check browser console for CSS errors (F12)

### Menu not working on mobile
- JavaScript must be enabled
- Check if `script.js` is in the same folder

## 📞 Support

For issues or questions:
1. Check browser console (F12) for errors
2. Verify all files are present
3. Ensure images are in correct location
4. Test in a different browser

## 📜 License

This portfolio template is open for personal use. Feel free to customize and deploy!

---

**Made with ❤️ for Chandra Shekhar Yadav**
Last Updated: 2025
