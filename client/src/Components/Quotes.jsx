import React from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  EmailShareButton,
} from "react-share";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";

const QuoteCard = () => {
  const quote =
    " There should be people or institutions that will finance projects with little chance of success but with great potential significance.";
  const author = "Yuri Milner";
  const role = "Investor, Entrepreneur and Philanthropist";
  const url = window.location.href;
  const hashtags = ["inspiration", "quote", "entrepreneurship"];

  return (
    <div className="max-w-2xl mx-auto p-8 my-12 bg- rounded-lg shadow-sm border border-gray-100 text-center">
      {/* Header */}
      <div className="text-xsfont-bold tracking-widest text-gray-500 mb-6 fw-semibold">
        QUOTE OF THE DAY
      </div>

      {/* Quote Number */}
      <div className="text-4xl font-light text-gray-300 mb-6">#66</div>

      {/* Quote Text */}
      <p className="text-xl p-2 text-gray-700 mb-8 px-4 font-bold fw-bold">
        {quote}
      </p>

      {/* Author Info */}
      <div className="mb-10">
        <p className="text-lg text-primary-800">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>

      <hr/>

      {/* Share Section */}
      <div className="mb-2 text-xs font-bold tracking-widest text-gray-500">
        SHARE THIS INSPIRATION
      </div>
      
      {/* Social Icons */}
      <div className="flex justify-center gap-4">
        <TwitterShareButton 
          url={url} 
          title={`"${quote}" - ${author}`} 
          hashtags={hashtags}
        >
          <div className="text-gray-500 hover:text-blue-400 p-2 transition-colors">
            <FaTwitter size={18} />
          </div>
        </TwitterShareButton>
        
        <FacebookShareButton 
          url={url} 
          quote={`"${quote}" - ${author}`} 
          hashtag="#quote"
        >
          <div className="text-gray-500 hover:text-blue-600 p-2 transition-colors">
            <FaFacebookF size={18} />
          </div>
        </FacebookShareButton>
        
        <LinkedinShareButton 
          url={url} 
          title={`Quote by ${author}`} 
          summary={quote}
        >
          <div className="text-gray-500 hover:text-blue-700 p-2 transition-colors">
            <FaLinkedinIn size={18} />
          </div>
        </LinkedinShareButton>
        
        <EmailShareButton 
          url={url} 
          subject={`Inspirational Quote by ${author}`} 
          body={`"${quote}"\n\n- ${author}, ${role}`}
        >
          <div className="text-gray-500 hover:text-gray-700 p-2 transition-colors">
            <FaEnvelope size={18} />
          </div>
        </EmailShareButton>

      </div>
    </div>
  );
};

export default QuoteCard;