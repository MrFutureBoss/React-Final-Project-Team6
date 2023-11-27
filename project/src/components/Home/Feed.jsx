import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Feed = ({ followedAuthor }) => {

    const [articlesCount, setArticlesCount] = useState(0);
    const [token, setToken] = useState(localStorage.getItem('userToken'));
    const [n1Articles, setn1Articles] = useState([]);
    const nav = useNavigate()

    const [feedArticles, setFeedArticles] = useState([]);

    useEffect(() => {
        const setDefaultToken = async () =>{
          axios.defaults.headers.common['Authorization'] =  await `Bearer ${localStorage.getItem("userToken")}`;
        }
        setDefaultToken();
    }, [localStorage.getItem("userToken")]);

    useEffect(() => {
        // Fetch articles by the followed author
        if(followedAuthor){
            axios.get(followedAuthor)
            .then(data => {
                setFeedArticles(data.data.articles);
                console.log(data)
            })
            .catch(error => {
                console.error('Error fetching feed articles:', error);
            });
        }
    }, [followedAuthor]);

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
            const anArticles = await axios.get(`https://api.realworld.io/api/articles/${slug}`,{ headers })

             setn1Articles(anArticles.data.article)
              
        } catch (error) {
            console.log(error);
        }
    }


    const handleFavorite = (slug) => {
        getAnArticles(slug);
        if(!token){
            nav('/login');
        }
        else{
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

    const handleDetail = (slug) => {
        nav(`/article/${slug}`)
    }

    


    return (
        <>
            {/* <Header/> */}

            {feedArticles?.map(articles => (
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
                        className={`btn btn-sm btn-outline-success btn-heart ${articles.favorited ? 'bg-success text-white' : ''}`}
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
                        {/* list tag */}
                        <ul className='tag-list'>
                            {articles.tagList.map(tag => (
                                <li key={tag} className='tag-item hover:cursor-pointer'>{tag}</li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
            ))}

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

            <Pagination
                className='mr-32 ml-32 pagination'
                currentPage={activePage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            >
                {paginationItems}
            </Pagination>
        </>
    );
}

export default Feed;
