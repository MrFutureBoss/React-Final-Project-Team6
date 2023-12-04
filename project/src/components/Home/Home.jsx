
import React, { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import "./Home.css"; 
import "./Pagination.css"; 
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";
import axios from 'axios';
import GlobalFeed from './GlobalFeed';
import Tags from "./Tags";

const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Date(dateString).toLocaleDateString(undefined, mergedOptions);
};

const PAGE_SIZE = 10; 

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [n1Articles, setn1Articles] = useState([]);
  const [followedAuthor, setFollowedAuthor] = useState(null);
  const [activeTab, setActiveTab] = useState('global');
  const [tag, setTag] = useState();

  useEffect(() => {
    const setDefaultToken = async () => {
      axios.defaults.headers.common['Authorization'] = await `Bearer ${localStorage.getItem("userToken")}`;
    }
    setDefaultToken();
  }, [localStorage.getItem("userToken")]);

  const nav = useNavigate()

  const limit = 10;

  useEffect(() => {
    const offset = (activePage - 1) * limit;

    if (token) {
      axios.get(`https://api.realworld.io/api/articles${activeTab === 'yourFeed' ? '/feed' : ''}?limit=${limit}&offset=${offset}${tag ? `&tag=${tag}` : ''}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
        // .then(response => response.json())
        .then(data => {
          setArticles(data.data.articles);
          setArticlesCount(data.data.articlesCount);
        })
        .catch(error => console.error('Error fetching articles:', error));
    } else {
      axios.get(`https://api.realworld.io/api/articles?limit=${limit}&offset=${offset}${tag ? `&tag=${tag}` : ''}`)
        // .then(response => response.json())
        .then(data => {
          setArticles(data.data.articles);
          setArticlesCount(data.data.articlesCount);
        })
        .catch(error => console.error('Error fetching articles:', error));
    }
  }, [activePage, n1Articles, activeTab, tag]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  }

  const handleDetail = (slug) => {
    nav(`/article/${slug}`)
  }

  const handleFilter = (e) => {
    const offset = (activePage - 1) * limit;
    const tag = e
    axios.get(`https://api.realworld.io/api/articles?limit=${limit}&offset=${offset}&tag=${tag}`)
      // .then(response => response.json())
      .then(data => {
        setArticles(data.data.articles);
        setArticlesCount(data.data.articlesCount);
      })
      .catch(error => console.error('Error fetching articles:', error));
    setTag(e);
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const getAnArticles = async (slug) => {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('userToken')}`
    }
    try {
      const anArticles = await axios.get(`https://api.realworld.io/api/articles/${slug}`, { headers })

      setn1Articles(anArticles.data.article)

    } catch (error) {
      console.log(error);
    }
  }

  const totalPages = Math.ceil(articlesCount / limit);

  // Dynamically generate pagination items based on totalPages
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === activePage}
        className='pagination-item'
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const handleFavorite = (slug) => {
    getAnArticles(slug);
    if (!token) {
      nav('/login');
    }
    else {
      try {
        const headers = {
          'Authorization': `Bearer ${token}`
        }

        if (n1Articles.favorited) {
          const respons = axios.delete(`https://api.realworld.io/api//articles/${slug}/favorite`, {
            headers
          })
        }
        else {
          const respons = axios.post(`https://api.realworld.io/api//articles/${slug}/favorite`, {}, {
            headers
          })

        }
      } catch (error) {
        console.log(" handle favorites");

      }
    }
  }

  const handleYourFeed = () => {
    setFollowedAuthor(/* Set the followed author */);
    setActiveTab('yourFeed');
  };

  const handleGlobalFeed = () => {
    setFollowedAuthor(null); // Reset the followed author
    setActiveTab('global');
  };

  return (
    <>
      <Header />
      <Banner />
    <br /> <br />
      <Container>
      <div className='pr-32 pl-32 pt-10 row'>
        <div className='col-md-9'>
          <div className='feed-toggle' style={{ borderBottom: '1px solid lightgray' }}>
            <ul className='nav nav-pills feed-item'>
              {token && <li className='nav-item'>
                <a className={`nav-link feed-tag ${activeTab === 'yourFeed' && !tag ? 'active' : ''}`}
                  onClick={handleYourFeed}>Your Feed</a>
              </li>}
              <li className='nav-item'>
                <a className={`nav-link feed-tag ${activeTab === 'global' && !tag ? 'active' : ''}`}
                  onClick={handleGlobalFeed}>Global Feed</a>
              </li>
              {tag &&
                <li className='nav-item'>
                  <a className={`nav-link feed-tag ${activeTab === 'global' ? 'active' : ''}`}># {tag}</a>
                </li>
              }

            </ul>
          </div>

          {articles.map((articles, index) => (
            <div key={articles.slug} className='article-preview'>
              <div className='d-flex justify-between align-items-center'>
                <div className='article-meta d-flex align-items-center gap-3'>
                  <a className='d-inline-block'>
                    <img src={articles.author.image} alt='error' />
                  </a>
                  <div className='info'>
                    <a className='no-underline hover:underline hover:cursor-pointer'>{articles.author.username}</a>
                    <span className='feed-date'>{formatDate(articles.updatedAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleFavorite(articles.slug)}
                  className={`btn btn-sm btn-outline-succes btn-heart ${articles.favorited ? 'bg-success text-white' : ''}`}
                  style={{ borderColor: '#5CB85C' }}
                >
                  <i className={`fa fa-heart ${articles.favorited ? 'text-white' : ''}`}></i>
                  <span className='ml-1' style={{ fontWeight: '400' }}>{articles.favoritesCount}</span>
                </button>
              </div>

              <div className='d-block' onClick={() => handleDetail(articles.slug)}>
                <h1 className='article-title'>{articles.title}</h1>
                <p className='article-description'>{articles.description}</p>
                <div className='d-flex align-items-center justify-between'>
                  <span className='article-read-more hover:cursor-pointer'>Read more ...</span>
                  <ul className='tag-list'>
                    {articles.tagList.map(tag => (
                      <li key={tag} className='tag-item hover:cursor-pointer'>{tag}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          ))}

          {/* {activeTab === 'yourFeed' ? <YourFeed  followedAuthor={'https://api.realworld.io/api/articles/feed'}/> : <YourFeed  followedAuthor={'https://api.realworld.io/api/articles'}/>} */}


        </div>

        <div className='col-md-3'>
          <div className='sidebar'>
            <p>Popular Tags</p>

            <div className='popular-tags'>
              <a className='popular-tags-item' onClick={(e) => handleFilter("welcome")} >welcome</a>
              <a className='popular-tags-item' onClick={(e) => handleFilter("implementations")} >implementations</a>
              <a className='popular-tags-item' onClick={(e) => handleFilter("introduction")} >introduction</a>
              <a className='popular-tags-item' onClick={(e) => handleFilter("codebaseShow")} >codebaseShow</a>
              <a className='popular-tags-item' onClick={(e) => handleFilter("ipsum")} >ipsum</a>
              <a className='popular-tags-item' onClick={(e) => handleFilter("qui")} >qui</a>
              <a className='popular-tags-item' onClick={(e) => handleFilter("et")} >et</a>
              <a className='popular-tags-item' onClick={(e) => handleFilter("cupiditate")} >cupiditate</a>
              <a className='popular-tags-item' onClick={(e) => handleFilter("quia")} >quia</a>
              <a className='popular-tags-item' onClick={(e) => handleFilter("deserunt")} >deserunt</a>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        className='mr-32 ml-32 pagination'
        currentPage={activePage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      >
        {paginationItems}
      </Pagination>

      </Container>
      
      
      <Footer />
    </>
  );
};

export default Home;
