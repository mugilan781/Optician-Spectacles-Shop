// Controller logic for dynamic article rendering in OptiLux Journal
document.addEventListener('DOMContentLoaded', () => {
  // 1. Client-side Routing and Data Fetching
  const urlParams = new URLSearchParams(window.location.search);
  let articleId = urlParams.get('id');

  // Fallback to myopia if id is empty, null or invalid
  if (!articleId) {
    articleId = 'myopia';
  }

  const blogData = window.optiluxBlogData || [];
  let article = blogData.find(item => item.id === articleId);
  
  if (!article) {
    article = blogData.find(item => item.id === 'myopia') || blogData[0];
  }

  if (!article) {
    console.error("No articles found in blog-data.js.");
    return;
  }

  // 2. Update Browser Title and SEO Description
  document.title = article.seoTitle || (article.title + ' | OptiLux');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', article.seoDescription || article.shortDescription);
  }

  // 3. Render Breadcrumb State
  const activeBreadcrumb = document.getElementById('breadcrumb-active');
  if (activeBreadcrumb) {
    activeBreadcrumb.textContent = article.title;
  }

  // 4. Render Hero Section
  const heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    heroBg.style.backgroundImage = `url('${article.heroImage}')`;
  }
  
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    heroTitle.textContent = article.title;
  }

  const heroCategory = document.getElementById('hero-category');
  if (heroCategory) {
    heroCategory.textContent = article.category;
  }

  const heroMeta = document.getElementById('hero-meta');
  if (heroMeta) {
    heroMeta.textContent = `${article.date} · ${article.readingTime}`;
  }

  const authorImg = document.getElementById('author-img');
  if (authorImg) {
    authorImg.src = article.authorImage;
    authorImg.alt = article.author;
  }

  const authorName = document.getElementById('author-name');
  if (authorName) {
    authorName.textContent = article.author;
  }

  const authorDeg = document.getElementById('author-deg');
  if (authorDeg) {
    authorDeg.textContent = article.designation;
  }

  // 5. Render Lead Intro and Featured Image
  const articleLead = document.getElementById('article-lead');
  if (articleLead) {
    articleLead.textContent = article.leadParagraph;
  }

  const articleFeaturedImg = document.getElementById('article-featured-img');
  if (articleFeaturedImg) {
    articleFeaturedImg.src = article.thumbnail;
    articleFeaturedImg.alt = article.title;
  }

  // 6. Render Article Body Markup
  const articleBody = document.getElementById('article-body');
  if (articleBody) {
    articleBody.innerHTML = article.fullContent;
  }

  // 7. Render Key Takeaways
  const takeawaysContainer = document.getElementById('takeaways-container');
  if (takeawaysContainer && article.keyTakeaways) {
    takeawaysContainer.innerHTML = article.keyTakeaways.map(takeaway => `
      <div class="takeaway-card">
        <div class="takeaway-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <p>${takeaway}</p>
      </div>
    `).join('');
  }

  // 8. Render Expert Tip Text
  const expertTipText = document.getElementById('expert-tip-text');
  if (expertTipText) {
    expertTipText.textContent = article.expertTip;
  }

  // 9. Render FAQ Items
  const faqContainer = document.getElementById('faq-container');
  if (faqContainer && article.faq) {
    faqContainer.innerHTML = article.faq.map((item, idx) => `
      <div class="accordion-item" id="faq-item-${idx}">
        <button class="accordion-header" onclick="toggleFaq(${idx})">
          <span>${item.question}</span>
          <span class="accordion-icon">+</span>
        </button>
        <div class="accordion-content" id="faq-content-${idx}">
          <div class="accordion-inner">
            <p>${item.answer}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 10. Generate Table of Contents
  const tocContainer = document.getElementById('toc-container');
  if (tocContainer && articleBody) {
    const headings = articleBody.querySelectorAll('h2');
    if (headings.length > 0) {
      tocContainer.innerHTML = Array.from(headings).map((h2, idx) => {
        const headingId = `section-heading-${idx}`;
        h2.id = headingId;
        return `<li><a class="toc-link" onclick="scrollToElement('${headingId}')">${h2.textContent}</a></li>`;
      }).join('');
    } else {
      // Hide widget if no subheadings exist
      const tocWidget = tocContainer.closest('.sidebar-widget');
      if (tocWidget) tocWidget.style.display = 'none';
    }
  }

  // 11. Render Author Info in Sidebar
  const sidebarAuthorImg = document.getElementById('sidebar-author-img');
  if (sidebarAuthorImg) {
    sidebarAuthorImg.src = article.authorImage;
    sidebarAuthorImg.alt = article.author;
  }

  const sidebarAuthorName = document.getElementById('sidebar-author-name');
  if (sidebarAuthorName) {
    sidebarAuthorName.textContent = article.author;
  }

  const sidebarAuthorRole = document.getElementById('sidebar-author-role');
  if (sidebarAuthorRole) {
    sidebarAuthorRole.textContent = article.designation;
  }

  const sidebarAuthorBio = document.getElementById('sidebar-author-bio');
  if (sidebarAuthorBio) {
    sidebarAuthorBio.textContent = article.authorBio;
  }

  // 12. Setup Share Action Event Listeners
  const fbShare = document.getElementById('share-facebook');
  if (fbShare) {
    fbShare.onclick = () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    };
  }

  const liShare = document.getElementById('share-linkedin');
  if (liShare) {
    liShare.onclick = () => {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
    };
  }

  const twShare = document.getElementById('share-twitter');
  if (twShare) {
    twShare.onclick = () => {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank');
    };
  }

  const copyShare = document.getElementById('share-copy');
  if (copyShare) {
    copyShare.onclick = () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const toast = document.getElementById('copy-feedback-toast');
        if (toast) {
          toast.style.display = 'block';
          setTimeout(() => {
            toast.style.display = 'none';
          }, 3000);
        }
      }).catch(err => {
        console.error("Failed to copy link: ", err);
      });
    };
  }

  // 13. Dynamic Previous and Next Navigation (Wrap-Around Mode)
  const currentIndex = blogData.findIndex(item => item.id === article.id);
  if (currentIndex !== -1 && blogData.length > 1) {
    const prevIndex = (currentIndex - 1 + blogData.length) % blogData.length;
    const nextIndex = (currentIndex + 1) % blogData.length;
    
    const prevArticle = blogData[prevIndex];
    const nextArticle = blogData[nextIndex];
    
    const prevBtn = document.getElementById('prev-article-btn');
    const prevTitle = document.getElementById('prev-article-title');
    if (prevBtn && prevTitle) {
      prevBtn.href = `blog-details.html?id=${prevArticle.id}`;
      prevTitle.textContent = prevArticle.title;
    }
    
    const nextBtn = document.getElementById('next-article-btn');
    const nextTitle = document.getElementById('next-article-title');
    if (nextBtn && nextTitle) {
      nextBtn.href = `blog-details.html?id=${nextArticle.id}`;
      nextTitle.textContent = nextArticle.title;
    }
  }

  // 14. Render Related Articles Grid (Exclude current)
  const relatedArticlesContainer = document.getElementById('related-articles-container');
  if (relatedArticlesContainer) {
    const related = blogData.filter(item => item.id !== article.id);
    relatedArticlesContainer.innerHTML = related.map((item, idx) => `
      <article class="blog-card reveal ${idx === 1 ? 'stagger-2' : idx === 2 ? 'stagger-3' : ''}">
        <div class="blog-card-img" style="height:220px;overflow:hidden">
          <img src="${item.thumbnail}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover" />
        </div>
        <div class="blog-card-body" style="display:flex; flex-direction:column; height:calc(100% - 220px)">
          <div class="blog-meta">
            <span class="blog-category">${item.category}</span>
            <span class="blog-date">${item.date}</span>
            <span class="blog-read-time" style="margin-left:auto">${item.readingTime}</span>
          </div>
          <h3 style="margin-bottom:var(--space-2)">
            <a href="blog-details.html?id=${item.id}" style="color:inherit; text-decoration:none">${item.title}</a>
          </h3>
          <p style="flex-grow:1; margin-bottom:var(--space-4); line-height: 1.6; font-size: var(--text-sm);">${item.shortDescription}</p>
          <div class="blog-card-footer" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:var(--space-4)">
            <div class="blog-author-mini">
              <img src="${item.authorImage}" alt="${item.author}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid var(--sapphire)" />
              <span>${item.author}</span>
            </div>
            <a href="blog-details.html?id=${item.id}" class="btn btn-primary btn-sm" style="padding:var(--space-2) var(--space-4); font-size:var(--text-xs); border-radius:var(--radius-full)">Read Article</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  // 15. Reading Progress Percentage Handler
  const updateReadingProgress = () => {
    const progressFill = document.getElementById('page-progress');
    if (!progressFill) return;
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (docHeight > 0) {
      const percentage = (scrollTop / docHeight) * 100;
      progressFill.style.width = `${percentage}%`;
    }
  };
  
  window.addEventListener('scroll', updateReadingProgress);
  updateReadingProgress(); // Initial call
});

// Interactive FAQ Accordion Action Handler
window.toggleFaq = function(index) {
  const item = document.getElementById(`faq-item-${index}`);
  const content = document.getElementById(`faq-content-${index}`);
  if (!item || !content) return;

  const isActive = item.classList.contains('active');
  
  // Close any open accordions
  document.querySelectorAll('.accordion-item').forEach(el => {
    el.classList.remove('active');
    const innerContent = el.querySelector('.accordion-content');
    if (innerContent) {
      innerContent.style.maxHeight = null;
    }
  });

  // Open clicked one if it wasn't already active
  if (!isActive) {
    item.classList.add('active');
    content.style.maxHeight = `${content.scrollHeight}px`;
  }
};

// Smooth Table of Contents Scrolling Action Handler
window.scrollToElement = function(id) {
  const target = document.getElementById(id);
  if (target) {
    const headerOffset = 100;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
