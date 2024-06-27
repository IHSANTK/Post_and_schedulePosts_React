import { useState, useEffect } from 'react';
import './Posts.css';

export default function Posts() {
    const [postOptions, setPostOptions] = useState(false);
    const [scheduleOptions, setScheduleOptions] = useState(false);
    const [formData, setFormData] = useState({ image: null, text: '' });
    const [scheduledFormData, setScheduledFormData] = useState({ image: null, text: '', date: '' });
    const [imagePreview, setImagePreview] = useState('');
    const [scheduledImagePreview, setScheduledImagePreview] = useState('');
    const [posts, setPosts] = useState([]);
    const [scheduledPosts, setScheduledPosts] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showScheduledPosts, setShowScheduledPosts] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleData = (event) => {
        if (event.target.name === 'image') {
            const file = event.target.files[0];
            setFormData({
                ...formData,
                [event.target.name]: file,
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({
                ...formData,
                [event.target.name]: event.target.value,
            });
        }
    };

    const handleScheduledData = (event) => {
        if (event.target.name === 'image') {
            const file = event.target.files[0];
            setScheduledFormData({
                ...scheduledFormData,
                [event.target.name]: file,
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setScheduledImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setScheduledFormData({
                ...scheduledFormData,
                [event.target.name]: event.target.value,
            });
        }
    };

    const handleSubmit = () => {
        setPosts([...posts, { ...formData, imagePreview }]);
        setFormData({ image: null, text: '' });
        setImagePreview('');
    };

    const handleScheduleSubmit = () => {
        setScheduledPosts([...scheduledPosts, { ...scheduledFormData, imagePreview: scheduledImagePreview }]);
        setScheduledFormData({ image: null, text: '', date: '' });
        setScheduledImagePreview('');
        setScheduleOptions(false);
    };

    const isDateReached = (scheduledDate) => new Date(scheduledDate) <= currentDate;

    return (
        <div className="container">
            <div className="header">
                <button className="button" onClick={() => { setPostOptions(true); setScheduleOptions(false); }}>Post</button>
                <button className="button" onClick={() => { setScheduleOptions(true); setPostOptions(false); }}>Schedule</button>
            </div>

            {postOptions && (
                <div className="form">
                    <input
                        className="input"
                        name='image'
                        type="file"
                        onChange={handleData}
                    />
                    <input
                        className="input"
                        name='text'
                        type="text"
                        value={formData.text}
                        placeholder="Enter text"
                        onChange={handleData}
                    />
                    <button className="submit-button" type='submit' onClick={handleSubmit}>Submit</button>
                </div>
            )}

            {scheduleOptions && (
                <div className="form">
                    <input
                        className="input"
                        name='image'
                        type="file"
                        onChange={handleScheduledData}
                    />
                    <input
                        className="input"
                        name='text'
                        type="text"
                        value={scheduledFormData.text}
                        placeholder="Enter text"
                        onChange={handleScheduledData}
                    />
                    <input
                        className="input"
                        name='date'
                        type="datetime-local"
                        value={scheduledFormData.date}
                        onChange={handleScheduledData}
                    />
                    <button className="submit-button" type='submit' onClick={handleScheduleSubmit}>Submit</button>
                </div>
            )}

            <div className="posts">
                {posts.map((post, index) => (
                    <div className="card" key={index}>
                        {post.imagePreview && <img className="card-img" src={post.imagePreview} alt="Posted" />}
                        <p>{post.text}</p>
                    </div>
                ))}
            </div>

            <div>
                <button className="button" onClick={() => setShowScheduledPosts(!showScheduledPosts)}>
                    {showScheduledPosts ? 'Hide Scheduled Posts' : 'Show Scheduled Posts'}
                </button>
            </div>

            {showScheduledPosts && (
                <div className="scheduled-posts">
                    {scheduledPosts.map((scheduledPost, index) => (
                        <div className="card" key={index}>
                            <p>Scheduled for: {new Date(scheduledPost.date).toLocaleString()}</p>
                            {isDateReached(scheduledPost.date) && (
                                <div>
                                    {scheduledPost.imagePreview && <img className="card-img" src={scheduledPost.imagePreview} alt="Scheduled" />}
                                    <p>{scheduledPost.text}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
