document.addEventListener('DOMContentLoaded', function initializeProjectFilter() {
    const projectCards = document.querySelectorAll('.project-card');
    const filterContainer = document.querySelector('.filter-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearAllButton = document.querySelector('.clear-all-filters');
    const activeFilters = new Set();

    function extractAllTags() {
        const allTagsSet = new Set();
        projectCards.forEach(function addCardTags(card) {
            const tags = card.querySelectorAll('.tag');
            tags.forEach(function addTag(tag) {
                allTagsSet.add(tag.textContent.trim());
            });
        });
        return Array.from(allTagsSet).sort();
    }

    function createFilterButtons() {
        const allTags = extractAllTags();
        const filterButtonsContainer = filterContainer.querySelector('.filter-buttons');

        allTags.forEach(function createButton(tagName) {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = tagName;
            button.setAttribute('data-tag', tagName);
            button.setAttribute('aria-pressed', 'false');
            button.addEventListener('click', function toggleFilter() {
                handleFilterToggle(tagName, button);
            });
            filterButtonsContainer.appendChild(button);
        });
    }

    function handleFilterToggle(tagName, button) {
        if (activeFilters.has(tagName)) {
            activeFilters.delete(tagName);
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        } else {
            activeFilters.add(tagName);
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
        }
        filterProjects();
        updateClearButtonVisibility();
    }

    function filterProjects() {
        if (activeFilters.size === 0) {
            projectCards.forEach(function showAllCards(card) {
                card.style.display = '';
            });
            return;
        }

        projectCards.forEach(function filterCard(card) {
            const cardTags = Array.from(card.querySelectorAll('.tag')).map(function getTagText(tag) {
                return tag.textContent.trim();
            });

            const hasAllActiveTags = Array.from(activeFilters).every(function checkTag(activeTag) {
                return cardTags.includes(activeTag);
            });

            if (hasAllActiveTags) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function clearAllFilters() {
        activeFilters.clear();
        filterButtons.forEach(function deactivateButton(button) {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        });
        filterProjects();
        updateClearButtonVisibility();
    }

    function updateClearButtonVisibility() {
        if (clearAllButton) {
            if (activeFilters.size > 0) {
                clearAllButton.style.display = 'inline-block';
            } else {
                clearAllButton.style.display = 'none';
            }
        }
    }

    function handleUrlParameters() {
        const urlParameters = new URLSearchParams(window.location.search);
        const tagParameter = urlParameters.get('tag');

        if (tagParameter) {
            const decodedTag = decodeURIComponent(tagParameter);
            const tagButton = document.querySelector(`.filter-btn[data-tag="${decodedTag}"]`);
            if (tagButton) {
                handleFilterToggle(decodedTag, tagButton);
            }
        }
    }

    if (filterContainer) {
        createFilterButtons();

        if (clearAllButton) {
            clearAllButton.addEventListener('click', clearAllFilters);
            updateClearButtonVisibility();
        }

        handleUrlParameters();
    }
});
