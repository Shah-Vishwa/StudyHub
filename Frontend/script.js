// StudyHub landing page interactions.

// Route guards - run immediately to prevent flashing of unauthorized pages
(function runRouteGuards() {
    const user = getStoredUser();
    const path = window.location.pathname.toLowerCase();
    const isDashboardPage = path.includes('student-dashboard.html') || path.includes('/dashboard.html');
    const isProfilePage = path.includes('profile.html');
    const isSettingsPage = path.includes('settings.html');
    const isUploadPage = path.includes('upload.html');
    const isAuthPage = path.includes('login.html') || path.includes('register.html');

    if ((isDashboardPage || isProfilePage || isSettingsPage || isUploadPage) && !user) {
        window.location.href = 'login.html';
    } else if (isUploadPage && user && user.role.toLowerCase() === 'student') {
        window.location.href = 'student-dashboard.html';
    } else if (isAuthPage && user) {
        window.location.href = getSignedInLandingPage(user);
    }
})();

function getStoredUser() {
    const userString = localStorage.getItem('studyhub_user');

    if (!userString) {
        return null;
    }

    try {
        return JSON.parse(userString);
    } catch (error) {
        localStorage.removeItem('studyhub_user');
        return null;
    }
}

function normalizeRole(role) {
    return (role || 'student').toString().trim().toLowerCase();
}

function getProfileCopy(role) {
    const profileCopies = {
        student: {
            eyebrow: 'Student profile',
            roleLabel: 'Student',
            summary: 'Track your courses, assignments, and study goals from one account.',
            focusLabel: 'Learning focus',
            focusPoints: [
                'Review your next lesson and upcoming assignment deadlines.',
                'Keep an eye on certificates and course completion progress.',
                'Jump straight back into your active courses from the dashboard.'
            ],
            quickLinks: [
                { label: 'Open student dashboard', href: 'student-dashboard.html' },
                { label: 'Browse courses', href: 'course.html' },
                { label: 'Contact support', href: 'contact.html' }
            ],
            primaryAction: { label: 'Open dashboard', href: 'student-dashboard.html' },
            secondaryAction: { label: 'Browse courses', href: 'course.html' },
            status: 'Active'
        },
        teacher: {
            eyebrow: 'Teacher profile',
            roleLabel: 'Teacher',
            summary: 'Manage class content, review student progress, and keep sessions organized.',
            focusLabel: 'Teaching focus',
            focusPoints: [
                'Review course materials and plan the next session.',
                'Check feedback, submissions, and student progress updates.',
                'Prepare announcements and learning resources for your classes.'
            ],
            quickLinks: [
                { label: 'Open dashboard', href: 'dashboard.html' },
                { label: 'Review courses', href: 'course.html' },
                { label: 'Contact support', href: 'contact.html' }
            ],
            primaryAction: { label: 'Open dashboard', href: 'dashboard.html' },
            secondaryAction: { label: 'Review courses', href: 'course.html' },
            status: 'Active'
        },
        administrator: {
            eyebrow: 'Administrator profile',
            roleLabel: 'Administrator',
            summary: 'Oversee accounts, platform activity, and content operations from one profile.',
            focusLabel: 'Administration focus',
            focusPoints: [
                'Monitor account activity and platform usage trends.',
                'Review content updates and support requests as they arrive.',
                'Use the dashboard to keep platform operations moving smoothly.'
            ],
            quickLinks: [
                { label: 'Open dashboard', href: 'dashboard.html' },
                { label: 'View site pages', href: 'index.html' },
                { label: 'Contact support', href: 'contact.html' }
            ],
            primaryAction: { label: 'Open dashboard', href: 'dashboard.html' },
            secondaryAction: { label: 'View site pages', href: 'index.html' },
            status: 'Active'
        }
    };

    return profileCopies[normalizeRole(role)] || profileCopies.student;
}

function formatMemberSince(createdAt) {
    if (!createdAt) {
        return 'Recently';
    }

    const parsedDate = new Date(createdAt);

    if (Number.isNaN(parsedDate.getTime())) {
        return 'Recently';
    }

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(parsedDate);
}

function getSignedInLandingPage() {
    return 'profile.html';
}

const courseCatalog = [
    {
        id: 'linux',
        title: 'Linux Administration Bootcamp',
        category: 'Linux Administration',
        instructor: 'Sarah Johnson',
        duration: '10 Weeks',
        level: 'Beginner',
        rating: '4.9',
        price: '$69',
        imageSrc: '/assets/linux-course.svg',
        imageClass: 'course-card__art--linux',
        description: 'Build confidence managing servers, packages, permissions, and services.',
        fullDescription: 'This hands-on course walks you through real Linux administration tasks, including package management, file permissions, service troubleshooting, and everyday command-line workflows.',
        curriculum: ['Command line essentials', 'Users, groups, and permissions', 'Service management and troubleshooting', 'Server hardening basics'],
        outcomes: ['Create and manage users and groups', 'Secure files and directories', 'Diagnose common Linux issues'],
        requirements: ['Basic computer literacy', 'A Linux VM or cloud instance', 'Willingness to practice each week'],
        reviews: [
            { name: 'Riya', role: 'Cloud Engineer', text: 'The labs were practical and the instructor explained each step clearly.' },
            { name: 'Daniel', role: 'IT Support Analyst', text: 'I felt comfortable using Linux commands after only a few lessons.' }
        ]
    },
    {
        id: 'git',
        title: 'Git & GitHub Essentials',
        category: 'Version Control',
        instructor: 'Alex Morgan',
        duration: '6 Weeks',
        level: 'Intermediate',
        rating: '4.8',
        price: '$49',
        imageSrc: '/assets/github-course.svg',
        imageClass: 'course-card__art--github',
        description: 'Master branching, commits, pull requests, and collaboration workflows with confidence.',
        fullDescription: 'Learn the Git habits that make team collaboration smoother, including branching strategies, commit history reviews, and pull request etiquette.',
        curriculum: ['Version control fundamentals', 'Branching and merging', 'GitHub collaboration', 'Reviewing pull requests'],
        outcomes: ['Create clean branches', 'Write helpful commit messages', 'Review PRs with confidence'],
        requirements: ['A GitHub account', 'Basic familiarity with the terminal', 'Comfort with editing files'],
        reviews: [
            { name: 'Mina', role: 'Frontend Developer', text: 'The workflow examples made version control feel much less intimidating.' },
            { name: 'Tara', role: 'Product Engineer', text: 'I now use branches and pull requests in every project.' }
        ]
    },
    {
        id: 'networking',
        title: 'Networking Fundamentals',
        category: 'Networking',
        instructor: 'Priya Patel',
        duration: '8 Weeks',
        level: 'Beginner',
        rating: '4.7',
        price: '$59',
        emoji: '🌐',
        imageClass: 'course-card__art--security',
        description: 'Understand IP addressing, routing, diagnostics, and common network troubleshooting steps.',
        fullDescription: 'This course turns networking basics into practical skills, from subnetting and routing to diagnosing connectivity issues with real-world examples.',
        curriculum: ['IP addressing and subnetting', 'Routing and switching basics', 'Connectivity troubleshooting', 'DNS and firewalls'],
        outcomes: ['Understand TCP/IP basics', 'Troubleshoot connectivity', 'Recognize common network services'],
        requirements: ['Basic computer knowledge', 'Interest in infrastructure', 'A browser and notebook'],
        reviews: [
            { name: 'Jules', role: 'Sysadmin', text: 'The troubleshooting lessons helped me solve issues faster at work.' },
            { name: 'Noah', role: 'Support Engineer', text: 'The visual explanations made routing much easier to understand.' }
        ]
    },
    {
        id: 'aws',
        title: 'AWS Cloud Practitioner',
        category: 'AWS Cloud',
        instructor: 'Michael Chen',
        duration: '9 Weeks',
        level: 'Beginner',
        rating: '5.0',
        price: '$79',
        imageSrc: '/assets/aws-course.svg',
        imageClass: 'course-card__art--aws',
        description: 'Strengthen your understanding of cloud concepts, AWS services, security, and budgeting.',
        fullDescription: 'Explore the core building blocks of AWS, from compute and storage to security, IAM, and billing basics that matter in practical cloud projects.',
        curriculum: ['Core cloud concepts', 'Compute and storage choices', 'Security and IAM basics', 'Cost awareness and monitoring'],
        outcomes: ['Describe core AWS services', 'Compare compute and storage options', 'Understand security and billing basics'],
        requirements: ['No prior AWS experience required', 'Basic internet browsing skills', 'Curiosity about cloud platforms'],
        reviews: [
            { name: 'Anika', role: 'Operations Analyst', text: 'The course gave me the confidence to speak about AWS in interviews.' },
            { name: 'Leo', role: 'DevOps Trainee', text: 'The examples made services like EC2 and S3 easy to remember.' }
        ]
    }
];

const yearSpan = document.querySelector('.year');
const navbar = document.getElementById('site-navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('primary-navigation');
const backToTopButton = document.querySelector('.back-to-top');
const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');
const courseSearchInput = document.getElementById('course-search-input');
const courseEmptyState = document.getElementById('course-empty-state');

function renderCourseCards() {
    const container = document.getElementById('courses-grid');

    if (!container) {
        return;
    }

    container.innerHTML = courseCatalog.map((course) => `
        <article class="course-card reveal" data-course="${course.id}" data-search="${[course.title, course.category, course.instructor, course.duration, course.level, course.rating, course.price, course.description].join(' ').toLowerCase()}">
            <div class="course-card__art ${course.imageClass}" aria-hidden="true">
                ${course.imageSrc ? `<img class="course-card__image" src="${course.imageSrc}" alt="">` : `<span class="course-card__emoji">${course.emoji}</span>`}
            </div>
            <div class="course-card__body">
                <div class="course-card__meta">
                    <span>${course.category}</span>
                    <span>★ ${course.rating}</span>
                </div>
                <h3>${course.title}</h3>
                <p class="course-card__instructor">Instructor: ${course.instructor}</p>
                <div class="course-card__details">
                    <span>${course.duration}</span>
                    <span>${course.level}</span>
                    <span>${course.price}</span>
                </div>
                <div class="course-card__actions">
                    <a class="button button--course" href="course-detail.html?course=${course.id}">Details</a>
                </div>
            </div>
        </article>
    `).join('');

    container.querySelectorAll('.course-card').forEach((card) => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                return;
            }

            const courseId = card.getAttribute('data-course');
            if (courseId) {
                window.location.href = `course-detail.html?course=${courseId}`;
            }
        });
    });

    container.querySelectorAll('.reveal').forEach((element) => {
        if (typeof revealObserver !== 'undefined') {
            revealObserver.observe(element);
        }
    });

    container.querySelectorAll('.course-card__actions a').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    });

    updateCourseSearch(courseSearchInput ? courseSearchInput.value : '');
}

function updateCourseSearch(query) {
    const container = document.getElementById('courses-grid');

    if (!container) {
        return;
    }

    const normalizedQuery = query.trim().toLowerCase();
    const cards = Array.from(container.querySelectorAll('.course-card'));
    let visibleCount = 0;

    cards.forEach((card) => {
        const searchableText = card.dataset.search || '';
        const matches = !normalizedQuery || searchableText.includes(normalizedQuery);
        card.hidden = !matches;

        if (matches) {
            visibleCount += 1;
        }
    });

    if (courseEmptyState) {
        courseEmptyState.hidden = visibleCount !== 0;
    }
}

function renderCourseDetails() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('course') || 'linux';
    const course = courseCatalog.find((entry) => entry.id === slug) || courseCatalog[0];

    const title = document.getElementById('course-title');
    const description = document.getElementById('course-description');
    const category = document.getElementById('course-category');
    const duration = document.getElementById('course-duration');
    const level = document.getElementById('course-level');
    const price = document.getElementById('course-price');
    const image = document.getElementById('course-image');
    const fullDescription = document.getElementById('course-full-description');
    const curriculum = document.getElementById('course-curriculum');
    const outcomes = document.getElementById('course-outcomes');
    const requirements = document.getElementById('course-requirements');
    const instructor = document.getElementById('course-instructor');
    const reviews = document.getElementById('course-reviews');
    const enrollButton = document.getElementById('enroll-details');

    if (!title || !description || !category || !duration || !level || !price || !image || !fullDescription || !curriculum || !outcomes || !requirements || !instructor || !reviews || !enrollButton) {
        return;
    }

    title.textContent = course.title;
    description.textContent = course.description;
    category.textContent = course.category;
    duration.textContent = course.duration;
    level.textContent = course.level;
    price.textContent = course.price;
    image.className = `page-hero__image ${course.imageClass}`;
    fullDescription.textContent = course.fullDescription;
    curriculum.innerHTML = course.curriculum.map((item) => `<li>${item}</li>`).join('');
    outcomes.innerHTML = course.outcomes.map((item) => `<li>${item}</li>`).join('');
    requirements.innerHTML = course.requirements.map((item) => `<li>${item}</li>`).join('');
    instructor.innerHTML = `
        <div class="detail-card__profile">
            <strong>${course.instructor}</strong>
            <p>Senior trainer with 12+ years of industry and teaching experience.</p>
        </div>
    `;
    reviews.innerHTML = course.reviews.map((review) => `
        <div class="review-card">
            <div class="review-card__top">
                <strong>${review.name}</strong>
                <span>${review.role}</span>
            </div>
            <p>${review.text}</p>
        </div>
    `).join('');
    enrollButton.href = `register.html?course=${course.id}`;
}

// Fill in the current year in the footer.
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studyhub-theme', theme);

    if (themeToggle) {
        const isDark = theme === 'dark';
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.querySelector('.theme-toggle__icon').textContent = isDark ? '🌙' : '☀️';
        themeToggle.querySelector('.theme-toggle__label').textContent = isDark ? 'Dark' : 'Light';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

const preferredTheme = localStorage.getItem('studyhub-theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(preferredTheme || (systemPrefersDark ? 'dark' : 'light'));

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

function updateDynamicUI() {
    const loggedInUser = getStoredUser();

    if (!loggedInUser) {
        return;
    }

    const profileCopy = getProfileCopy(loggedInUser.role);

    const nav = document.getElementById('primary-navigation');
    if (nav) {
        const authLinks = Array.from(nav.querySelectorAll('a')).filter((link) => {
            const href = link.getAttribute('href') || '';
            return href.includes('login.html') || href.includes('register.html') || href.includes('signup.html');
        });
        authLinks.forEach((link) => link.remove());

        const dashboardLink = Array.from(nav.querySelectorAll('a')).find((link) => {
            const href = link.getAttribute('href') || '';
            return href.includes('student-dashboard.html') || href.includes('dashboard.html');
        });
        if (dashboardLink) {
            dashboardLink.href = profileCopy.primaryAction.href;
        }

        const greeting = document.createElement('span');
        greeting.className = 'nav__user-greeting';
        greeting.textContent = `Hi, ${loggedInUser.firstName}`;

        const profileLink = document.createElement('a');
        profileLink.className = 'nav__link nav__link--ghost';
        profileLink.href = 'profile.html';
        profileLink.textContent = 'Profile';

        let uploadLink = null;
        if (loggedInUser.role && (loggedInUser.role.toLowerCase() === 'teacher' || loggedInUser.role.toLowerCase() === 'administrator')) {
            uploadLink = document.createElement('a');
            uploadLink.className = 'nav__link nav__link--ghost';
            uploadLink.href = 'upload.html';
            uploadLink.textContent = 'Upload Center';
        }

        const logoutBtn = document.createElement('a');
        logoutBtn.className = 'nav__link nav__link--ghost';
        logoutBtn.id = 'logout-btn';
        logoutBtn.href = '#';
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('studyhub_user');
            window.location.href = 'index.html';
        });

        nav.appendChild(greeting);
        nav.appendChild(profileLink);
        if (uploadLink) {
            nav.appendChild(uploadLink);
        }
        nav.appendChild(logoutBtn);
    }

    const welcomeHeading = document.querySelector('.dashboard-hero h1');
    if (welcomeHeading) {
        welcomeHeading.textContent = `Welcome back, ${loggedInUser.firstName}`;
    }

    const profileHeading = document.getElementById('profile-heading');
    const profileSummary = document.getElementById('profile-summary');
    const profileEyebrow = document.getElementById('profile-eyebrow');
    const profileRole = document.getElementById('profile-role');
    const profileJoined = document.getElementById('profile-joined');
    const profileFocusShort = document.getElementById('profile-focus-short');
    const profileStatus = document.getElementById('profile-status');
    const profileRoleTag = document.getElementById('profile-role-tag');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileRoleLabel = document.getElementById('profile-role-label');
    const profileMemberSince = document.getElementById('profile-member-since');
    const profileFocusList = document.getElementById('profile-focus-list');
    const profileQuickLinks = document.getElementById('profile-quick-links');
    const profilePrimaryAction = document.getElementById('profile-primary-action');
    const profileSecondaryAction = document.getElementById('profile-secondary-action');
    const profileFocusHeading = document.getElementById('profile-focus-heading');
    const profilePhoto = document.getElementById('profile-photo');
    const profilePhotoFallback = document.getElementById('profile-photo-fallback');
    const profilePhotoNote = document.getElementById('profile-photo-note');
    const deleteAccountButton = document.getElementById('delete-account-button');
    const settingsForm = document.getElementById('profile-settings-form');
    const settingsFirstName = document.getElementById('settings-first-name');
    const settingsLastName = document.getElementById('settings-last-name');
    const settingsEmail = document.getElementById('settings-email');
    const settingsPhone = document.getElementById('settings-phone');
    const settingsPhoto = document.getElementById('settings-photo');
    const settingsBio = document.getElementById('settings-bio');
    const settingsSkills = document.getElementById('settings-skills');
    const settingsCurrentPassword = document.getElementById('settings-current-password');
    const settingsNewPassword = document.getElementById('settings-new-password');
    const settingsConfirmPassword = document.getElementById('settings-confirm-password');
    const settingsMessage = document.getElementById('profile-settings-message');

    if (profileHeading || profileSummary || profileEyebrow || profileRole || profileJoined || profileFocusShort || profileStatus || profileRoleTag || profileName || profileEmail || profileRoleLabel || profileMemberSince || profileFocusList || profileQuickLinks || profilePrimaryAction || profileSecondaryAction || profileFocusHeading || profilePhoto || profilePhotoFallback || profilePhotoNote) {
        if (profileHeading) {
            profileHeading.textContent = `Welcome back, ${loggedInUser.firstName}`;
        }

        if (profileSummary) {
            profileSummary.textContent = profileCopy.summary;
        }

        if (profileEyebrow) {
            profileEyebrow.textContent = profileCopy.eyebrow;
        }

        if (profileRole) {
            profileRole.textContent = profileCopy.roleLabel;
        }

        if (profileJoined) {
            profileJoined.textContent = formatMemberSince(loggedInUser.createdAt);
        }

        if (profileFocusShort) {
            profileFocusShort.textContent = profileCopy.focusLabel;
        }

        if (profileStatus) {
            profileStatus.textContent = profileCopy.status;
        }

        if (profileRoleTag) {
            profileRoleTag.textContent = profileCopy.eyebrow;
        }

        if (profileName) {
            profileName.textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
        }

        if (profileEmail) {
            profileEmail.textContent = loggedInUser.email;
        }

        if (profileRoleLabel) {
            profileRoleLabel.textContent = profileCopy.roleLabel;
        }

        if (profileMemberSince) {
            profileMemberSince.textContent = formatMemberSince(loggedInUser.createdAt);
        }

        if (profileFocusHeading) {
            profileFocusHeading.textContent = profileCopy.focusLabel;
        }

        const profileInitials = `${loggedInUser.firstName?.charAt(0) || ''}${loggedInUser.lastName?.charAt(0) || ''}`.trim().toUpperCase() || 'U';
        const profilePictureUrl = (loggedInUser.profilePicture || '').trim();

        if (profilePhotoFallback) {
            profilePhotoFallback.textContent = profileInitials;
        }

        if (profilePhoto) {
            if (profilePictureUrl) {
                profilePhoto.src = profilePictureUrl;
                profilePhoto.hidden = false;
                profilePhoto.alt = `${loggedInUser.firstName} ${loggedInUser.lastName} profile photo`;

                if (profilePhotoFallback) {
                    profilePhotoFallback.hidden = true;
                }

                if (profilePhotoNote) {
                    profilePhotoNote.textContent = 'Profile photo saved.';
                }
            } else {
                profilePhoto.removeAttribute('src');
                profilePhoto.hidden = true;

                if (profilePhotoFallback) {
                    profilePhotoFallback.hidden = false;
                }

                if (profilePhotoNote) {
                    profilePhotoNote.textContent = 'Space reserved for a profile picture.';
                }
            }
        }

        if (profileFocusList) {
            profileFocusList.innerHTML = profileCopy.focusPoints.map((point) => `
                <div class="dashboard-task">
                    <p class="dashboard-card__subtle">${point}</p>
                </div>
            `).join('');
        }

        if (profileQuickLinks) {
            profileQuickLinks.innerHTML = profileCopy.quickLinks.map((link) => `
                <a href="${link.href}">${link.label}</a>
            `).join('');
        }

        if (profilePrimaryAction) {
            profilePrimaryAction.textContent = profileCopy.primaryAction.label;
            profilePrimaryAction.href = profileCopy.primaryAction.href;
        }

        if (profileSecondaryAction) {
            profileSecondaryAction.textContent = profileCopy.secondaryAction.label;
            profileSecondaryAction.href = profileCopy.secondaryAction.href;
        }

        document.title = `${profileCopy.roleLabel} Profile | StudyHub`;
    }

    // Independent Settings Form Logic
    if (settingsForm) {
        if (settingsFirstName) settingsFirstName.value = loggedInUser.firstName || '';
        if (settingsLastName) settingsLastName.value = loggedInUser.lastName || '';
        if (settingsEmail) settingsEmail.value = loggedInUser.email || '';
        if (settingsPhone) settingsPhone.value = loggedInUser.phone || '';
        if (settingsPhoto) settingsPhoto.value = loggedInUser.profilePicture || '';
        if (settingsBio) settingsBio.value = loggedInUser.bio || '';
        if (settingsSkills) settingsSkills.value = Array.isArray(loggedInUser.skills) ? loggedInUser.skills.join(', ') : '';

        settingsForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (settingsMessage) {
                settingsMessage.textContent = 'Saving settings...';
                settingsMessage.style.color = 'var(--primary)';
            }

            const payload = {
                firstName: settingsFirstName ? settingsFirstName.value.trim() : '',
                lastName: settingsLastName ? settingsLastName.value.trim() : '',
                email: settingsEmail ? settingsEmail.value.trim() : '',
                phone: settingsPhone ? settingsPhone.value.trim() : '',
                profilePicture: settingsPhoto ? settingsPhoto.value.trim() : '',
                bio: settingsBio ? settingsBio.value.trim() : '',
                skills: settingsSkills ? settingsSkills.value.trim() : '',
                currentPassword: settingsCurrentPassword ? settingsCurrentPassword.value : '',
                newPassword: settingsNewPassword ? settingsNewPassword.value : '',
                confirmPassword: settingsConfirmPassword ? settingsConfirmPassword.value : ''
            };

            try {
                const endpoint = window.location.protocol === 'file:'
                    ? `http://localhost:3000/api/users/${loggedInUser.id}/settings`
                    : `/api/users/${loggedInUser.id}/settings`;

                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Unable to save settings.');
                }

                const updatedUser = result.user || { ...loggedInUser, ...payload };
                localStorage.setItem('studyhub_user', JSON.stringify(updatedUser));

                if (settingsMessage) {
                    settingsMessage.textContent = 'Settings saved successfully.';
                    settingsMessage.style.color = '#22c55e';
                }

                window.location.reload();
            } catch (error) {
                if (settingsMessage) {
                    settingsMessage.textContent = error.message || 'Failed to save settings.';
                    settingsMessage.style.color = '#ef4444';
                }
            }
        });

        document.title = `${profileCopy.roleLabel} Settings | StudyHub`;
    }

    // Independent Delete Account Logic
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', () => {
            const confirmed = window.confirm('Delete your account from this browser session? This cannot be undone here.');

            if (!confirmed) {
                return;
            }

            localStorage.removeItem('studyhub_user');
            window.location.href = 'index.html';
        });
    }
}

async function loadDashboardStats() {
    const path = window.location.pathname.toLowerCase();
    if (!path.includes('student-dashboard.html')) {
        return;
    }

    const activeEl = document.getElementById('metric-active-courses');
    const dueEl = document.getElementById('metric-assignments-due');
    const completionEl = document.getElementById('metric-completion');
    const statusEl = document.getElementById('metric-api-status');

    if (!activeEl || !dueEl || !completionEl || !statusEl) {
        return;
    }

    try {
        const endpoint = window.location.protocol === 'file:' 
            ? 'http://localhost:3000/api/student-dashboard' 
            : '/api/student-dashboard';
            
        const response = await fetch(endpoint);
        if (response.ok) {
            const data = await response.json();
            activeEl.textContent = data.activeCourses;
            dueEl.textContent = data.assignmentsDue;
            completionEl.textContent = `${data.completion}%`;
            statusEl.textContent = data.apiStatus.toUpperCase();
            statusEl.style.color = '#22c55e'; // Highlight green for live
        } else {
            statusEl.textContent = 'ERROR';
            statusEl.style.color = '#ef4444';
        }
    } catch (error) {
        statusEl.textContent = 'OFFLINE';
        statusEl.style.color = '#94a3b8';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCourseCards();
    renderCourseDetails();
    updateDynamicUI();
    loadDashboardStats();

    if (courseSearchInput) {
        courseSearchInput.addEventListener('input', (event) => {
            updateCourseSearch(event.target.value);
        });
    }
});

// Smooth scrolling for all internal navigation links.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        const targetElement = targetId ? document.querySelector(targetId) : null;

        if (!targetElement) {
            return;
        }

        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close the mobile menu after a link is chosen.
        if (navMenu && navMenu.classList.contains('is-open')) {
            closeMobileMenu();
        }
    });
});

function openMobileMenu() {
    if (!navToggle || !navMenu) {
        return;
    }

    navToggle.classList.add('is-open');
    navMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
}

function closeMobileMenu() {
    if (!navToggle || !navMenu) {
        return;
    }

    navToggle.classList.remove('is-open');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const menuIsOpen = navMenu && navMenu.classList.contains('is-open');

        if (menuIsOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

// Close the menu if the viewport becomes large again.
window.addEventListener('resize', () => {
    if (window.innerWidth > 860) {
        closeMobileMenu();
    }
});

// Add a stronger shadow to the navbar after the user scrolls.
function updateNavbarState() {
    if (!navbar || !backToTopButton) {
        return;
    }

    const hasScrolled = window.scrollY > 20;
    navbar.classList.toggle('is-scrolled', hasScrolled);
    backToTopButton.classList.toggle('is-visible', window.scrollY > 500);
}

window.addEventListener('scroll', updateNavbarState, { passive: true });
updateNavbarState();

// Reveal sections with a simple fade-in animation as they enter the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.18,
    rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach((element) => revealObserver.observe(element));

// Animate the statistic counters once the stats section becomes visible.
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.45
});

function animateCounter(element) {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '+';
    const duration = 1600;
    const startTime = performance.now();

    function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        element.textContent = `${value.toLocaleString()}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(step);
            return;
        }

        element.textContent = `${target.toLocaleString()}${suffix}`;
    }

    requestAnimationFrame(step);
}

counters.forEach((counter) => counterObserver.observe(counter));

// Scroll back to the top of the page when the floating button is clicked.
if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
