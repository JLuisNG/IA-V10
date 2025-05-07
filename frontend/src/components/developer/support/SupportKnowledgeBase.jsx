import React, { useState, useEffect } from 'react';
import '../../../styles/developer/support/SupportKnowledgeBase.scss';

const DevSupportKnowledgeBase = ({ preview = false }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Datos simulados de categorías
  const mockCategories = [
    { id: 'getting-started', name: 'Getting Started', icon: 'fa-rocket', color: '#4CAF50', count: 15 },
    { id: 'account-billing', name: 'Account & Billing', icon: 'fa-credit-card', color: '#FF9800', count: 12 },
    { id: 'patient-management', name: 'Patient Management', icon: 'fa-user-injured', color: '#2196F3', count: 18 },
    { id: 'scheduling', name: 'Scheduling & Calendar', icon: 'fa-calendar-alt', color: '#9C27B0', count: 14 },
    { id: 'integrations', name: 'Integrations', icon: 'fa-plug', color: '#607D8B', count: 10 },
    { id: 'reports-analytics', name: 'Reports & Analytics', icon: 'fa-chart-bar', color: '#F44336', count: 9 },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: 'fa-wrench', color: '#795548', count: 16 }
  ];
  
  // Datos simulados de artículos
  const mockArticles = [
    {
      id: 1,
      title: 'Getting Started with TherapySync',
      category: 'getting-started',
      summary: 'A comprehensive guide to help you set up your TherapySync account and understand the basic functionality.',
      content: `
        <h1>Getting Started with TherapySync</h1>
        
        <p>Welcome to TherapySync, the all-in-one platform for healthcare professionals! This guide will help you get up and running with your new account.</p>
        
        <h2>Setting Up Your Account</h2>
        
        <p>After signing up, the first thing you'll want to do is complete your profile. Click on your name in the top-right corner and select "My Account" from the dropdown menu.</p>
        
        <p>On your account page, make sure to:</p>
        
        <ul>
          <li>Upload a profile picture</li>
          <li>Complete your professional information</li>
          <li>Set your availability hours</li>
          <li>Configure notification preferences</li>
        </ul>
        
        <h2>Creating Your First Patient Profile</h2>
        
        <p>To add a new patient:</p>
        
        <ol>
          <li>Navigate to the "Patients" section from the main menu</li>
          <li>Click the "Add New Patient" button</li>
          <li>Fill in the required information</li>
          <li>Click "Save" to create the patient profile</li>
        </ol>
        
        <h2>Navigating the Dashboard</h2>
        
        <p>Your dashboard gives you a quick overview of your daily schedule, patient information, and important notifications. You can customize the dashboard widgets by clicking the "Customize" button in the top-right corner of the dashboard.</p>
        
        <h2>Getting Help</h2>
        
        <p>If you have any questions or need assistance, you can:</p>
        
        <ul>
          <li>Check the Knowledge Base for more detailed guides</li>
          <li>Contact our support team via live chat</li>
          <li>Submit a support ticket for complex issues</li>
          <li>Join our weekly webinars for live demonstrations</li>
        </ul>
      `,
      author: 'TherapySync Team',
      datePublished: '2023-01-15',
      lastUpdated: '2023-03-01',
      tags: ['setup', 'beginner', 'configuration'],
      views: 4856,
      helpful: 723,
      notHelpful: 42
    },
    {
      id: 2,
      title: 'Understanding Billing Cycles and Subscription Options',
      category: 'account-billing',
      summary: 'Learn about the different billing cycles and subscription plans available in TherapySync.',
      content: '',
      author: 'Billing Department',
      datePublished: '2023-02-10',
      lastUpdated: '2023-03-05',
      tags: ['billing', 'subscription', 'payment'],
      views: 2347,
      helpful: 412,
      notHelpful: 28
    },
    {
      id: 3,
      title: 'Managing Patient Records and Information',
      category: 'patient-management',
      summary: 'A guide to efficiently manage patient records, medical history, and personal information.',
      content: '',
      author: 'Clinical Team',
      datePublished: '2023-01-20',
      lastUpdated: '2023-02-15',
      tags: ['patient records', 'data management', 'privacy'],
      views: 3892,
      helpful: 604,
      notHelpful: 31
    },
    {
      id: 4,
      title: 'Creating and Managing Appointment Schedules',
      category: 'scheduling',
      summary: 'Learn how to create and manage appointment schedules, set availability, and handle recurring appointments.',
      content: '',
      author: 'Operations Team',
      datePublished: '2023-01-25',
      lastUpdated: '2023-02-28',
      tags: ['scheduling', 'appointments', 'calendar'],
      views: 4211,
      helpful: 687,
      notHelpful: 35
    },
    {
      id: 5,
      title: 'Integrating External Calendar Systems',
      category: 'integrations',
      summary: 'How to sync your TherapySync calendar with external systems like Google Calendar, Outlook, and Apple Calendar.',
      content: '',
      author: 'Integration Team',
      datePublished: '2023-02-05',
      lastUpdated: '2023-03-10',
      tags: ['integration', 'calendar', 'sync'],
      views: 1876,
      helpful: 352,
      notHelpful: 19
    },
    {
      id: 6,
      title: 'Generating and Interpreting Reports',
      category: 'reports-analytics',
      summary: 'Guide to generating various reports and interpreting the analytics data in TherapySync.',
      content: '',
      author: 'Analytics Team',
      datePublished: '2023-02-15',
      lastUpdated: '2023-03-12',
      tags: ['reports', 'analytics', 'data'],
      views: 2109,
      helpful: 389,
      notHelpful: 22
    },
    {
      id: 7,
      title: 'Troubleshooting Common Login Issues',
      category: 'troubleshooting',
      summary: 'Solutions for common login problems, including password resets, account verification, and authentication errors.',
      content: '',
      author: 'Technical Support',
      datePublished: '2023-01-30',
      lastUpdated: '2023-03-08',
      tags: ['login', 'authentication', 'password', 'troubleshooting'],
      views: 5327,
      helpful: 943,
      notHelpful: 37
    },
    {
      id: 8,
      title: 'Setting Up Patient Reminder Notifications',
      category: 'patient-management',
      summary: 'Learn how to configure automated reminder notifications for patient appointments.',
      content: '',
      author: 'Product Team',
      datePublished: '2023-02-20',
      lastUpdated: '2023-03-15',
      tags: ['notifications', 'reminders', 'patient management'],
      views: 2754,
      helpful: 521,
      notHelpful: 24
    }
  ];
  
  // Simular carga de datos
  useEffect(() => {
    setTimeout(() => {
      setCategories(mockCategories);
      setArticles(mockArticles);
      
      // Establecer un artículo por defecto para vista previa
      if (preview && mockArticles.length > 0) {
        setSelectedArticle(mockArticles[0]);
        setRelatedArticles(getRelatedArticles(mockArticles[0]));
      }
      
      setLoading(false);
    }, 800);
  }, [preview]);
  
  // Cambiar la categoría seleccionada
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
  };
  
  // Seleccionar un artículo
  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
    setRelatedArticles(getRelatedArticles(article));
    if (preview) {
      setIsExpanded(true);
    }
  };
  
  // Buscar artículos que contienen el texto de búsqueda
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Filtrar artículos según la categoría seleccionada y texto de búsqueda
  const getFilteredArticles = () => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSearch = 
        !searchQuery || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  };
  
  // Obtener artículos relacionados
  const getRelatedArticles = (article) => {
    if (!article) return [];
    
    return articles
      .filter(a => 
        a.id !== article.id && (
          a.category === article.category || 
          a.tags.some(tag => article.tags.includes(tag))
        )
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };
  
  // Renderizar la vista principal
  return (
    <div className={`support-knowledge-base ${preview ? 'preview-mode' : ''} ${isExpanded ? 'expanded' : ''}`}>
      {!preview && (
        <div className="knowledge-header">
          <h2>Knowledge Base</h2>
          <div className="knowledge-search">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="knowledge-container">
        {/* Categorías */}
        {!preview && (
          <div className="knowledge-categories">
            <div className="categories-header">
              <h3>Categories</h3>
            </div>
            <div className="categories-list">
              <div 
                className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                <div className="category-icon all">
                  <i className="fas fa-th-large"></i>
                </div>
                <div className="category-info">
                  <span className="category-name">All Articles</span>
                  <span className="category-count">{articles.length}</span>
                </div>
              </div>
              
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <div className="category-icon" style={{ backgroundColor: category.color }}>
                    <i className={`fas ${category.icon}`}></i>
                  </div>
                  <div className="category-info">
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Lista de artículos */}
        <div className="knowledge-articles">
          {preview && (
            <div className="preview-header">
              <h3>Popular Articles</h3>
              <button className="preview-action" onClick={() => setIsExpanded(!isExpanded)}>
                <i className={`fas fa-${isExpanded ? 'compress-alt' : 'expand-alt'}`}></i>
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="articles-loading">
              <div className="loading-spinner"></div>
              <span>Loading articles...</span>
            </div>
          ) : getFilteredArticles().length > 0 ? (
            <div className="articles-list">
              {getFilteredArticles().slice(0, preview ? 3 : undefined).map((article) => (
                <div 
                  key={article.id}
                  className={`article-item ${selectedArticle && selectedArticle.id === article.id ? 'selected' : ''}`}
                  onClick={() => handleArticleSelect(article)}
                >
                  <div className="article-category">
                    {categories.find(c => c.id === article.category)?.name || 'Uncategorized'}
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-summary">{article.summary}</p>
                  <div className="article-meta">
                    <div className="article-info">
                      <div className="article-date">
                        <i className="fas fa-calendar-alt"></i>
                        <span>{article.lastUpdated}</span>
                      </div>
                      <div className="article-views">
                        <i className="fas fa-eye"></i>
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="article-rating">
                      <i className="fas fa-thumbs-up"></i>
                      <span>{article.helpful}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {preview && articles.length > 3 && (
                <div className="view-all-link">
                  <a href="#">
                    <span>View all articles</span>
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="no-articles">
              <div className="no-data-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3>No articles found</h3>
              <p>
                {searchQuery 
                  ? `No articles matching "${searchQuery}"`
                  : 'No articles available in this category'}
              </p>
            </div>
          )}
        </div>
        
        {/* Contenido del artículo */}
        <div className="article-content">
          {selectedArticle ? (
            <div className="article-details">
              <div className="article-header">
                <div className="article-category-badge" style={{ 
                  backgroundColor: categories.find(c => c.id === selectedArticle.category)?.color || '#607D8B' 
                }}>
                  <i className={`fas ${categories.find(c => c.id === selectedArticle.category)?.icon || 'fa-folder'}`}></i>
                  <span>{categories.find(c => c.id === selectedArticle.category)?.name || 'Uncategorized'}</span>
                </div>
                <h2 className="article-title">{selectedArticle.title}</h2>
                <div className="article-meta-details">
                  <div className="article-author">
                    <i className="fas fa-user"></i>
                    <span>{selectedArticle.author}</span>
                  </div>
                  <div className="article-date">
                    <i className="fas fa-calendar-alt"></i>
                    <span>Published: {selectedArticle.datePublished}</span>
                  </div>
                  <div className="article-updated">
                    <i className="fas fa-sync-alt"></i>
                    <span>Updated: {selectedArticle.lastUpdated}</span>
                  </div>
                </div>
                <div className="article-tags">
                  {selectedArticle.tags.map((tag, index) => (
                    <div key={index} className="article-tag">
                      <i className="fas fa-tag"></i>
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div 
                className="article-body"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content || '<p>Full content not available in preview mode.</p>' }}
              ></div>
              
              <div className="article-footer">
                <div className="article-helpfulness">
                  <h4>Was this article helpful?</h4>
                  <div className="helpfulness-buttons">
                    <button className="helpful-button">
                      <i className="fas fa-thumbs-up"></i>
                      <span>Yes</span>
                      <div className="helpful-count">{selectedArticle.helpful}</div>
                    </button>
                    <button className="not-helpful-button">
                      <i className="fas fa-thumbs-down"></i>
                      <span>No</span>
                      <div className="not-helpful-count">{selectedArticle.notHelpful}</div>
                    </button>
                  </div>
                </div>
                
                <div className="article-share">
                  <h4>Share this article</h4>
                  <div className="share-buttons">
                    <button className="share-button email">
                      <i className="fas fa-envelope"></i>
                    </button>
                    <button className="share-button link">
                      <i className="fas fa-link"></i>
                    </button>
                    <button className="share-button print">
                      <i className="fas fa-print"></i>
                    </button>
                    <button className="share-button pdf">
                      <i className="fas fa-file-pdf"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Artículos relacionados */}
              {relatedArticles.length > 0 && (
                <div className="related-articles">
                  <h3>Related Articles</h3>
                  <div className="related-articles-list">
                    {relatedArticles.map((article) => (
                      <div 
                        key={article.id}
                        className="related-article"
                        onClick={() => handleArticleSelect(article)}
                      >
                        <div className="related-article-category" style={{ 
                          backgroundColor: categories.find(c => c.id === article.category)?.color || '#607D8B' 
                        }}>
                          <i className={`fas ${categories.find(c => c.id === article.category)?.icon || 'fa-folder'}`}></i>
                        </div>
                        <div className="related-article-info">
                          <h4 className="related-article-title">{article.title}</h4>
                          <div className="related-article-meta">
                            <span className="related-article-views">
                              <i className="fas fa-eye"></i> {article.views.toLocaleString()}
                            </span>
                            <span className="related-article-helpful">
                              <i className="fas fa-thumbs-up"></i> {article.helpful}
                            </span>
                          </div>
                        </div>
                        <div className="related-article-arrow">
                          <i className="fas fa-chevron-right"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Contacto de soporte */}
              <div className="support-contact">
                <div className="contact-content">
                  <div className="contact-icon">
                    <i className="fas fa-headset"></i>
                  </div>
                  <div className="contact-info">
                    <h3>Still need help?</h3>
                    <p>If you couldn't find what you were looking for, our support team is here to help.</p>
                    <div className="contact-buttons">
                      <button className="contact-button primary">
                        <i className="fas fa-ticket-alt"></i>
                        <span>Submit a Ticket</span>
                      </button>
                      <button className="contact-button secondary">
                        <i className="fas fa-comments"></i>
                        <span>Live Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="article-empty">
              <div className="empty-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3>No Article Selected</h3>
              <p>Select an article from the list to view its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevSupportKnowledgeBase;