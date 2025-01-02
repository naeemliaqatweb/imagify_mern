import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const GenerateBtn = () => {
  const navigate = useNavigate();
  const { user, setShowLogin } = useContext(AppContext);
  const onClickHandler = () => {
    if (user) {
      navigate('/result');
    } else {
      setShowLogin(true);
    }

  }
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='pb-16 text-center'>
      <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold textx-neutral-800 py-6 md:py-16">
        See the magic. Try now
      </h1>
      <button className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white
      m-auto hover:scale-105 transition-all duration-500' onClick={onClickHandler}>Generate Images
        <img src={assets.star_group} className='h-6' alt="" />
      </button>
    </motion.div>

  )
}

export default GenerateBtn
