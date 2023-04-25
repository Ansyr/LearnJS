import react, {useEffect, useMemo, useRef, useState} from 'react'
import {getPageCount} from "../utils/page";
import {usePosts} from "../hooks/usePosts";
import PostService from "../API/PostService";
import MyButton from "../components/UI/Button/MyButton";
import MyModal from "../components/UI/Modal/MyModal";
import PostForm from "../components/PostForm";
import PostFilter from "../components/PostFilter";
import PostList from "../components/PostList";
import Pagination from "../components/UI/Pagination/Pagination";
import {useFetching} from "../hooks/useFetching";
import MyLoader from "../components/UI/Loader/MyLoader";
import {useObserver} from "../hooks/useObserver";
import MySelect from "../components/UI/Select/MySelect";


function Posts() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({sort: '', query: ''})
    const [modal, setModal] = useState(false)
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const lastElemtent = useRef();
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)

    const [fetchPosts, isLoading, postError] = useFetching(async () => {
        const response = await PostService.getAll(limit, page)
        setPosts([...posts,...response.data])
        const totalCount = response.headers['x-total-count'];
        setTotalPages(getPageCount(totalCount, limit))
    })


    useEffect(() => {
        fetchPosts(limit,page)
    }, [page,limit])

    useObserver(lastElemtent,page < totalPages , isLoading, ()=>{
        setPage(page + 1)
    })
    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }


    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    const changePage = (page) => {
        setPage(page)
    }

    return (
        <div className="App">
            <MyButton style={{marginTop: '30px'}} onClick={() => setModal(true)}>
                Создать пользователя
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>

            <hr style={{margin: '15px 0'}}/>
            <PostFilter filter={filter} setFilter={setFilter}/>
            <MySelect value={limit}
                      onChange={val => setLimit(val)}
                      defaultValue={'Кол-во элементов на странице'}
                      options={[
                          {value: 5,name: '5'},
                          {value: 10,name: '10'},
                          {value: -1,name: 'Показать всё    '},
                      ]}/>
            {postError &&
                <h1>Произошла ошибка{postError}</h1>
            }
            <PostList remove={removePost} posts={sortedAndSearchedPosts} title={'Список постов'}/>
            <div ref={lastElemtent} style={{height:20,background:"red"}}></div>

            {isLoading && <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}><MyLoader/></div>   }



            <Pagination totalPages={totalPages} page={page} changePage={changePage}/>

        </div>
    );
}

export default Posts;
