document.addEventListener('DOMContentLoaded', function initializeProjectFilter() {
    const projectCards = document.querySelectorAll('.project-card');
    const filterContainer = document.querySelector('.filter-container');
    const clearAllButton = document.querySelector('.clear-all-filters');

    const activeJobRoles = new Set();
    const activeTechnologyTags = new Set();

    const tagCategoryMapping = {
        devops: ['CI/CD', 'Docker', 'Docker Compose', 'GitHub Actions', 'Cloudflare Tunnel', 'Self-hosting', 'Ubuntu', 'Networking', 'DevOps'],
        backend: ['Python', 'Flask', 'Blueprints', '.NET', 'C#', 'MongoDB', 'REST API', 'TDD', 'Testcontainers'],
        gamedev: ['Unity', 'MonoGame', '3D', 'VR', 'Editor Tooling', 'Runtime Tools', 'Multiplayer', 'Sound Design', 'User Testing', 'Level Design', 'Educational Games', 'Educational Game', 'Prototype', 'Rapid Development', 'Funding'],
        performance: ['Performance', 'Compute Shaders', 'GPU', 'HLSL', 'DOTS', 'ECS', 'Lag Compensation', 'Snapshot Interpolation'],
        ai: ['ML-Agents', 'PPO', 'Reinforcement Learning', 'Machine Learning', 'AI vs Player'],
        leadership: ['Lead Dev', 'Scrum Master', 'Product Owner', 'Project Manager', 'Team Lead', 'Leadership', 'International Collaboration', 'Scrum']
    };

    function extractAllTagsFromProjects() {
        const allTagsSet = new Set();
        projectCards.forEach(function addCardTags(card) {
            const tags = card.querySelectorAll('.tag');
            tags.forEach(function addTag(tag) {
                allTagsSet.add(tag.textContent.trim());
            });
        });
        return allTagsSet;
    }

    function organizeTagsIntoCategories() {
        const allTags = extractAllTagsFromProjects();
        const categorizedTags = {};

        Object.keys(tagCategoryMapping).forEach(function initializeCategory(category) {
            categorizedTags[category] = [];
        });

        allTags.forEach(function categorizeTag(tag) {
            let wasAssigned = false;
            Object.keys(tagCategoryMapping).forEach(function checkCategory(category) {
                if (tagCategoryMapping[category].includes(tag)) {
                    categorizedTags[category].push(tag);
                    wasAssigned = true;
                }
            });
        });

        return categorizedTags;
    }

    function createTechnologyFilterButtons() {
        const categorizedTags = organizeTagsIntoCategories();

        Object.keys(categorizedTags).forEach(function createCategoryButtons(category) {
            const container = document.querySelector(`.tag-category-buttons[data-category="${category}"]`);
            if (!container) return;

            const tags = categorizedTags[category].sort();
            if (tags.length === 0) {
                container.parentElement.style.display = 'none';
                return;
            }

            tags.forEach(function createButton(tagName) {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.textContent = tagName;
                button.setAttribute('data-tag', tagName);
                button.setAttribute('aria-pressed', 'false');
                button.addEventListener('click', function toggleFilter() {
                    handleTechnologyTagToggle(tagName, button);
                });
                container.appendChild(button);
            });
        });
    }

    function initializeJobRoleFilters() {
        const jobRoleButtons = document.querySelectorAll('.job-role-filter-btn');
        jobRoleButtons.forEach(function addListener(button) {
            button.addEventListener('click', function toggleJobRole() {
                const role = button.getAttribute('data-role');
                handleJobRoleToggle(role, button);
            });
        });
    }

    function handleJobRoleToggle(role, button) {
        if (activeJobRoles.has(role)) {
            activeJobRoles.delete(role);
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        } else {
            activeJobRoles.add(role);
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
        }
        filterProjects();
        updateClearButtonVisibility();
    }

    function handleTechnologyTagToggle(tagName, button) {
        if (activeTechnologyTags.has(tagName)) {
            activeTechnologyTags.delete(tagName);
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        } else {
            activeTechnologyTags.add(tagName);
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
        }
        filterProjects();
        updateClearButtonVisibility();
    }

    function filterProjects() {
        const hasJobRoleFilter = activeJobRoles.size > 0;
        const hasTechnologyFilter = activeTechnologyTags.size > 0;

        if (!hasJobRoleFilter && !hasTechnologyFilter) {
            projectCards.forEach(function showAllCards(card) {
                card.style.display = '';
            });
            return;
        }

        projectCards.forEach(function filterCard(card) {
            let matchesJobRole = true;
            let matchesTechnology = true;

            if (hasJobRoleFilter) {
                const cardRoles = (card.getAttribute('data-job-roles') || '').split(',').map(function trimRole(role) {
                    return role.trim();
                });

                matchesJobRole = Array.from(activeJobRoles).some(function checkRole(activeRole) {
                    return cardRoles.includes(activeRole);
                });
            }

            if (hasTechnologyFilter) {
                const cardTags = Array.from(card.querySelectorAll('.tag')).map(function getTagText(tag) {
                    return tag.textContent.trim();
                });

                matchesTechnology = Array.from(activeTechnologyTags).every(function checkTag(activeTag) {
                    return cardTags.includes(activeTag);
                });
            }

            if (matchesJobRole && matchesTechnology) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function clearAllFilters() {
        activeJobRoles.clear();
        activeTechnologyTags.clear();

        document.querySelectorAll('.job-role-filter-btn').forEach(function deactivateButton(button) {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        });

        document.querySelectorAll('.filter-btn').forEach(function deactivateButton(button) {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        });

        filterProjects();
        updateClearButtonVisibility();
    }

    function updateClearButtonVisibility() {
        if (clearAllButton) {
            if (activeJobRoles.size > 0 || activeTechnologyTags.size > 0) {
                clearAllButton.style.display = 'inline-block';
            } else {
                clearAllButton.style.display = 'none';
            }
        }
    }

    function initializeCollapsibleSections() {
        const sectionHeaders = document.querySelectorAll('.filter-section-header');

        sectionHeaders.forEach(function addCollapsibleBehavior(header) {
            header.addEventListener('click', function toggleSection() {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                const content = header.nextElementSibling;
                const toggle = header.querySelector('.filter-section-toggle');

                if (isExpanded) {
                    header.setAttribute('aria-expanded', 'false');
                    content.style.display = 'none';
                    toggle.textContent = '▶';
                } else {
                    header.setAttribute('aria-expanded', 'true');
                    content.style.display = 'block';
                    toggle.textContent = '▼';
                }
            });
        });
    }

    function handleUrlParameters() {
        const urlParameters = new URLSearchParams(window.location.search);
        const roleParameter = urlParameters.get('role');
        const tagParameter = urlParameters.get('tag');

        if (roleParameter) {
            const decodedRole = decodeURIComponent(roleParameter);
            const roleButton = document.querySelector(`.job-role-filter-btn[data-role="${decodedRole}"]`);
            if (roleButton) {
                handleJobRoleToggle(decodedRole, roleButton);
            }
        }

        if (tagParameter) {
            const decodedTag = decodeURIComponent(tagParameter);
            const tagButton = document.querySelector(`.filter-btn[data-tag="${decodedTag}"]`);
            if (tagButton) {
                handleTechnologyTagToggle(decodedTag, tagButton);
            }
        }
    }

    if (filterContainer) {
        createTechnologyFilterButtons();
        initializeJobRoleFilters();
        initializeCollapsibleSections();

        if (clearAllButton) {
            clearAllButton.addEventListener('click', clearAllFilters);
            updateClearButtonVisibility();
        }

        handleUrlParameters();
    }
});
