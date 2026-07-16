import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function SinglePodcast() {
  const {user}                                                              = useSelector((state) => state.auth);

  return (
    <div>SinglePodcst</div>
  )
}

export default SinglePodcast