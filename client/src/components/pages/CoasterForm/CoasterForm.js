import React, { Component } from 'react'
import { Button, Form } from 'react-bootstrap'
import Spinner from '../../shared/Spinner/Spinner'
import CoastersService from '../../../services/coasters.service'
import UploadsService from '../../../services/uploads.service'

export default class CoasterForm extends Component {
  state = {
    title: "",
    description: "",
    imageUrl: "",
    inversions: 0,
    length: 0
  }

  uploadService = new UploadsService()
  coasterService = new CoastersService();

  handleChange = (e) => {
    const { value, name } = e.target;

    this.setState({
      ...this.state,
      [name]: value
    })
  }

  handleFile = (e) => {
    this.setState({
      ...this.state,
      isLoading: true
    })

    const uploadData = new FormData()
    uploadData.append('imageData', e.target.files[0])

    this.uploadService.uploadImg(uploadData)
      .then(res => {
        this.setState({
          ...this.state,
          isLoading: false,
          imageUrl: res.data.cloudinary_url
        })
      })
      .catch(err => alert("Error, esto lo hacéis vosotros."))
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.coasterService.createCoaster(this.state)
      .then(() => {
        this.props.closeModal();
        this.props.refreshCoasters();
        this.setState({
          title: "",
          description: "",
          imageUrl: "",
          inversions: 0,
          length: 0
        })
      })
      .catch(err => console.error(err))
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Título: </Form.Label>
          <Form.Control onChange={(e) => this.handleChange(e)} name="title" value={this.state.title} type="text" placeholder="Introduce título" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Descripción: </Form.Label>
          <Form.Control onChange={(e) => this.handleChange(e)} name="description" value={this.state.description} type="text" placeholder="Introduce descripción" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="inversions">
          <Form.Label>Inversiones: </Form.Label>
          <Form.Control onChange={(e) => this.handleChange(e)} name="inversions" value={this.state.inversions} type="number" placeholder="Introduce inversiones" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="length">
          <Form.Label>Longitud: </Form.Label>
          <Form.Control onChange={(e) => this.handleChange(e)} name="length" value={this.state.length} type="number" placeholder="Introduce longitud" />
        </Form.Group>

        {/* <Form.Group className="mb-3" controlId="imageUrl">
          <Form.Label>Imagen: </Form.Label>
          <Form.Control onChange={(e) => this.handleChange(e)} name="imageUrl" value={this.state.imageUrl} type="text" placeholder="Introduce imagen" />
        </Form.Group> */}

        <Form.Group className="mb-3" controlId="imageUrl">
          <Form.Label>Imagen: </Form.Label>
          <Form.Control onChange={(e) => this.handleFile(e)} name="imageUrl" type="file" />
        </Form.Group>


        {this.state.isLoading && <Spinner shape="circle" />}


        <Button disabled={this.state.isLoading} variant="primary" type="submit">
          {this.state.isLoading ? "Loading..." : "Submit"}
        </Button>
      </Form>
    )
  }
}
