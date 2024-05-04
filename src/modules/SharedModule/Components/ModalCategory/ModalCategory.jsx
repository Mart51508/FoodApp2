import React from 'react'
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';


function ModalCategory({show ,handleClose , onSubmit}) {
    const {handleSubmit , register , formState:{errors}} = useForm()

    return (
        <>
        <Modal show={show} onHide={handleClose} className="p-3" >
    <Modal.Header className="d-flex justify-content-between">
    <h3> Add Category</h3>
    <i onClick={handleClose} className="fa-solid fa-x m-3"></i>
    </Modal.Header>
        <Modal.Body className="p-4 rounded-2">
           <form onSubmit={submiting}>
                      <input
                        type="text"
                        className="form-control my-3"
                        placeholder="Category Name"
                        id="CategoryName"
                        {...register('name' , {required:'Name of Category is required'} )}
                      />
                    {errors.name ? <p className="alert alert-danger">{errors.name.message}</p> :''}
                    <div className="text-end">
                    <button className="btn btn-success ">Save</button>
                    </div>
          </form>
        </Modal.Body>
      </Modal>
        </>
    )
}

export default ModalCategory
