import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const BackPage = () => {

    const navigate = useNavigate();

    const handleBackPage = () => {
        navigate(-1);
    };



    return (
        <div>
            <Link to="/" />
                <button onClick={handleBackPage} className="text-[14px] text-text_2 hover:text-white transition cursor-pointer ml-[26px] mt-[36px] font-bold hover:font-semibold " >
                    <img src="https://img.icons8.com/ios-glyphs/30/ffffff/back.png" alt="back" />
                </button>
        </div>
    )
};

export default BackPage;