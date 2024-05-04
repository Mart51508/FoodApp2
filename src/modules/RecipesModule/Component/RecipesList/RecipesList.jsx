import axios from "axios";
import ImageHeader from "../../../../assets/images/header.png";
import Header from "../../../SharedModule/Components/Header/Header";
import { useEffect, useState } from "react";
import NoData from "../../../SharedModule/Components/NoData/NoData";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DeLeteData from "../../../SharedModule/Components/DeleteData/DeLeteData";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function RecipesList() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue
  } = useForm();

  const Navigate = useNavigate();

  const [Recipes, setRecipes] = useState([]);
  const [RecipesID, setRecipesID] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setEditingRecipe(null)
  }
  const handleShow = () => setShow(true);
  const [showDelete, setShowDelete] = useState(false);
  const handleDeleteClose = () => setShowDelete(false);
  const handleDeleteShow = (id) => {
    setRecipesID(id);
    setShowDelete(true);
  };
  const [EditingRecipe , setEditingRecipe]=useState(null)
  const [CategList, setCategList] = useState([]);
  const [TagList, setTagList] = useState([]);
  const [NameValue , setNameValue]=useState('')
  const [TagValue , setTagValue]=useState('')
  const [CatValue , setCatValue]=useState('')
  const [ArrayOfPages , setArrayOfPages ]= useState([])


  async function GetRecipes(name, tagId, categoryId , pageSize , pageNumber ) {
    try {
      let res = await axios.get(
        `https://upskilling-egypt.com:3006/api/v1/Recipe/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { name: name, tagId: tagId, categoryId: categoryId },
        }
      );
      setRecipes(res?.data?.data);
      setArrayOfPages(Array(res.data?.totalNumberOfPages).fill().map((_,i)=>i+1))
      console.log(res.data?.totalNumberOfPages);
    } catch (error) {
      console.log(error);
    }
  }

  async function onSubmit(data) {
    let resp;
    if(EditingRecipe){
      try {
        resp = axios.post(
         "https://upskilling-egypt.com:3006/api/v1/Recipe/",
         data,
         {
           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         }
       );
       GetRecipes();
       handleClose();
     } catch (error) {
       console.log(error);
     }
    }
    else{
      try {
        resp = axios.post(
         `https://upskilling-egypt.com:3006/api/v1/Recipe/${EditingRecipe.id}`,
         data,
         {
           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         }
       );
       GetRecipes();
       handleClose();
     } catch (error) {
       console.log(error);
     }
    }
  }
  async function DeleteRecipes() {
    try {
      const res = await axios.delete(
        `https://upskilling-egypt.com:3006/api/v1/Recipe/${RecipesID}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      GetRecipes();
      handleDeleteClose();
    } catch (error) {
      console.log(error);
    }
  }

  async function GoToRecipeForm() {
    Navigate("/Dashboard/RecipesForm");
  }

  async function GetCategory() {
    try {
      let resp = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/Category/?pageSize=10&pageNumber=1",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCategList(resp?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }


  async function GetTags() {
    try {
      let resp = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/tag",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTagList(resp?.data)
     console.log(resp ,'tags');
    } catch (error) {
      console.log(error);
    }
  }

  function GetNameValue(input) {
    setNameValue(input.target.value)
    GetRecipes(input.target.value ,TagValue , CatValue , 10, 1);
  }

  function GetTagValue(input) {
    setTagValue(input.target.value)
    GetRecipes( NameValue ,input.target.value , CatValue ,10, 1);

  }

  function GetCatValue(input) {
    setCatValue(input.target.value)
    GetRecipes(NameValue ,TagValue , input.target.value  , 5 , 1);
  }


  useEffect(() => {
    GetRecipes();
    GetTags()
    GetCategory('','','',5,1)
  }, []);
  return (
    <>
      <Header
        Bold={"Recipes"}
        title={" Items"}
        description={
          "you can now add your items that any user can order it from the Application and you can edit"
        }
        imgUrl={ImageHeader}
      />
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <div className="text m-3">
            <h5>Recipe Table Details</h5>
            <p className="my-1">you can check all details</p>
          </div>
          <div className="button m-3">
            <button onClick={GoToRecipeForm} className="btn btn-success m-1">
              Add new Items
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Search By Name.."
              className="form-control"
              onChange={GetNameValue}
            />
          </div>
          <div className="col-md-3">
          <select
              className="form-control text-muted"
              id="categoriesIds"
              onChange={GetTagValue}
            >
              <option value=''disabled  >
              Select Tags
              </option>

              {TagList.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
         <div className="col-md-3">
         <select
              className="form-control text-muted"
              placeholder="categories IDs"
              id="categoriesIds"
              onChange={GetCatValue}
            >
              <option value=''  disabled >
              Select Category
              </option>

              {CategList.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
         </div>
        </div>
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th scope="col">item Name</th>
              <th scope="col">image</th>
              <th scope="col">Price</th>
              <th scope="col">Description</th>
              <th scope="col">Tag</th>
              <th scope="col">Category</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {Recipes.length > 0 ? (
              Recipes.map((items, index) => (
                <tr key={index}>
                  <td>{items.name}</td>
                  <td>
                    {items.imagePath ? (
                      <img
                        src={
                          "https://upskilling-egypt.com:3006/" + items.imagePath
                        }
                        style={{ width: "100px" }}
                      />
                    ) : (
                      <img src={NoData} style={{ width: "100px" }} />
                    )}{" "}
                  </td>
                  <td>{items.price}</td>
                  <td>{items.description}</td>
                  <td>{items.tag.name}</td>
                  <td>{items?.category[0]?.name}</td>
                  <td>
                    <i className="fa-solid fa-pen-to-square mx-4 text-success"></i>
                    <i
                      onClick={() => {
                        handleDeleteShow(items.id);
                      }}
                      className="fa-solid fa-trash mx-4 text-danger"
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <NoData />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ul className="pagination">
    <li className="page-item">
      <a className="page-link" href="#" aria-label="Previous" >
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    {ArrayOfPages?.map((PageNo , index)=>(
    <li key={index} className="page-item"><a className="page-link" onClick={()=>{GetRecipes(NameValue , TagValue , CatValue , 5 , PageNo)}}>{PageNo}</a></li>
    ))}
    <li className="page-item">
      <a className="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4 rounded-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                className="form-control my-3"
                placeholder="Category Name"
                id="CategoryName"
                {...register("name", {
                  required: "Name of Category is required",
                })}
              />
              {errors.name ? (
                <p className="alert alert-danger">{errors.name.message}</p>
              ) : (
                ""
              )}
              <div className="text-end">
                <button className="btn btn-success ">Save</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* Delete modal */}
        <Modal show={showDelete} onHide={handleDeleteClose} className="p-3">
          <Modal.Body className="p-4 rounded-2">
            <DeLeteData item={"Category"} />
          </Modal.Body>
          <Modal.Footer>
            <button onClick={DeleteRecipes} className="btn btn-outline-danger">
              Delete this item
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default RecipesList;
