import React from 'react'

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <>
    <form onSubmit= {handleSubmit}>
    <div className='mb-3'>
        <input type='text' className='form-control' value={value} placeholder='Enter new category' onChange={(e) => setValue(e.target.value)}
        />

        <button type='submit'className='btn btn-primary'> 
            Submit 

        </button>
    </div>

    </form>
    </>
  )
};

export default CategoryForm;