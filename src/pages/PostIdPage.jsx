import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useFetching} from "../hooks/useFetching";
import PostService from "../API/PostService";
import MyLoader from "../components/UI/Loader/MyLoader";

const PostIdPage = () => {
    const {id} = useParams()
    const [post, setPost] = useState({});
    const [comments,setComments] = useState([]);
    const [fetchPostById, isLoading, error] = useFetching(async (id) => {
        const response = await PostService.getById(id)
        setPost(response.data);
    })
    const [fetchComments, isComLoading, comError] = useFetching(async (id) => {
        const response = await PostService.getCommentsByPostID(id)
        setComments(response.data)
    })

    useEffect(() => {
        fetchPostById(id)
        fetchComments(id)
    }, [])

    return (
        <div>
            <h1>Вы открыли страницу поста с ID = {id}</h1>
            {
                isLoading ? <MyLoader/> : <div>{post.id}. {post.title}</div>
            }
            <h1>
                Комментарии
            </h1>
            {isLoading? <MyLoader/> : <div  >{comments.map((com) =><div key={com.id}>
                <h5 style={{marginTop: 15}}>{com.email}</h5>
                <div>{com.body}</div>

            </div> )}</div>}
        </div>
    );
};

export default PostIdPage;