import React, { Component } from 'react';
import { Card, Button, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import '../../assets/styles/customStyles.css'
import avatarPlaceholder from '../../assets/images/user1.png'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      sex: '',
      birthday: '',
      address: '',
      img: avatarPlaceholder,
      firstNameField: '',
      lastNameField: '',
      emailField: '',
      phoneField: '',
      sexField: '',
      addressField: '',
      birthdayField: new Date(),
      imgField: null,
      validationErrors: [],
      validationIsBad: false,
      alertMsg: '',
      alertStatus: '',
      alertVisible: false
    }
  }

  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal
    }))
  }

  showAlert = (type, value) => {
    this.setState({ alert: '' })

    switch (type) {
        case 'Success':
          this.setState({ alertStatus: 'success' })
          this.setState({ alertMsg: 'Успешно!' })
          break
        case 'Error':
          this.setState({ alertStatus: 'danger' })
          this.setState({ alertMsg: 'Ошибка!' })
          break
        case 'ValidationError':
          this.setState({ alertStatus: 'danger' })
          this.setState({ alertMsg: value })
          break
        default:
          return 'Invalid type.'
        }
        this.setState({ alertVisible: true })
        setTimeout(() => {
            this.setState({ alertVisible: false })
            const fields = document.querySelectorAll('.is-invalid')
            fields.forEach((el) => {
              el.classList.remove('is-invalid')
            })
        }, 1500)
    }
  
    validation = (el) => {
      const name = /^[a-zA-Z]+$/
      const phone = /^[0-9\-+]{9,15}$/
      const birthday = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
      let validationError = ''

        switch(el.id) {
          case 'firstName':
              if (!name.test(el.value)) {
                  validationError = 'Name is not valid.'
                  el.classList.add('is-invalid')
              } else if (el.value.length <= 3) {
                  validationError = 'Name must contain more than 3 symbols.'
                  el.classList.add('is-invalid')
              } else {
                el.classList.remove('is-invalid')
              }
              break
          case 'lastName':
              if (!name.test(el.value)) {
                  validationError = 'Name is not valid.'
                  el.classList.add('is-invalid')
              } else if (el.value.length <= 3) {
                  validationError = 'Name must contain more than 3 symbols.'
                  el.classList.add('is-invalid')
              } else {
                el.classList.remove('is-invalid')
              }
              break
          case 'phone':
              if (!phone.test(el.value)) {
                  validationError = 'Phone is not valid.'
                  el.classList.add('is-invalid')
              } else {
                el.classList.remove('is-invalid')
              }
              break
          case 'birthday':
              if (!birthday.test(el.value)) {
                  validationError = 'Date format: 29/03/2001'
                  el.classList.add('is-invalid')
              } else {
                el.classList.remove('is-invalid')
              }
              break
        }

      return validationError
  }

  saveChanges = (e) => {
    e.preventDefault()

    let date = this.state.birthdayField
    let birthdayFormatted = [
      (date.getDate() > 9 ? '' : '0') + date.getDate(), '/',
      (date.getMonth() + 1 > 9 ? '' : '0') + (date.getMonth() + 1), '/',
      date.getFullYear()
    ].join('')

    let validationErrors = []
    for(let el of e.target.elements) {
      if (this.validation(el).length > 0) {
        validationErrors += ' ' + this.validation(el)
      }
    }

    if (!validationErrors.length > 0) {
      if(this.state.imgField) this.setState({ img: this.state.imgField })
      this.setState({
        firstName: this.state.firstNameField,
        lastName: this.state.lastNameField,
        email: this.state.emailField,
        phone: this.state.phoneField,
        sex: this.state.sexField,
        address: this.state.addressField,
        birthday: birthdayFormatted,
      })
  
      this.toggle()
  
      let { firstNameField, lastNameField, emailField, phoneField, birthdayField, sexField, addressField, imgField } = this.state
      if (!imgField) imgField = this.state.img 
      fetch('https://jsonplaceholder.typicode.com/users/1', {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          firstName: firstNameField,
          lastName: lastNameField,
          email: emailField,
          phone: phoneField,
          birthday: birthdayField,
          sex: sexField,
          address: addressField,
          img: imgField
        })
      })
      .then((res) => {
        if (res.status === 200) this.showAlert('Success')
        else this.showAlert('Error')
      })
    } else {
      this.showAlert('ValidationError', validationErrors)
    }
  }

  uploadImage = async (e) => {
    const file = e.target.files[0]
    const base64 = await this.convertToBase64(file)
    this.setState({ imgField: base64 })
  }

  convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = (err) => {
        reject(err)
      }
    })
  }

  componentDidMount() {
    fetch('db.json')
    .then((res) => res.json())
    .then((data) => {
      let user = data.users[0]
      let formatted = user.birthday.split('/')
      this.setState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        sex: user.sex,
        address: user.address,
        birthday: user.birthday,
        firstNameField: user.firstName,
        lastNameField: user.lastName,
        emailField: user.email,
        phoneField: user.phone,
        sexField: user.sex,
        addressField: user.address,
        birthdayField: new Date(`${formatted[1]}/${formatted[0]}/${formatted[2]}`) 
      })
    })
  }

  render() {
    return (
      <div>
        <Card body>
          <div className="text-center">
            <div className="m-b">
              <img src={this.state.img} style={{ width: 100, height: 100 }} className="b-circle" alt="profile" />
            </div>
            <div>
              <h2 className="h4">{`${this.state.firstName} ${this.state.lastName}`}</h2>
              <Button color="dark" onClick={this.toggle}>Edit profile</Button>
              <hr />
              <Row className="text-center m-b">
                <Col>
                  <strong>{this.state.phone}</strong>
                  <div className="text-muted">Phone</div>
                </Col>
                <Col>
                  <strong>{this.state.email}</strong>
                  <div className="text-muted">Email</div>
                </Col>
                <Col>
                  <strong>{this.state.birthday}</strong>
                  <div className="text-muted">Birthday</div>
                </Col>
                <Col>
                  <strong>{this.state.sex}</strong>
                  <div className="text-muted">Sex</div>
                </Col>
                <Col>
                  <strong>{this.state.address}</strong>
                  <div className="text-muted">Address</div>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Edit profile</ModalHeader>
            <ModalBody>
              <Form id="form" onSubmit={this.saveChanges}>
                <FormGroup>
                    <Label for="firstName">First Name</Label>
                    <Input type="text" id="firstName" value={this.state.firstNameField} onBlur={(e) => this.validation(e.target)} onChange={(e) => this.setState({ firstNameField: e.target.value })} required/>
                </FormGroup>
                <FormGroup>
                    <Label for="lastName">Last Name</Label>
                    <Input type="text" id="lastName" value={this.state.lastNameField} onBlur={(e) => this.validation(e.target)} onChange={(e) => this.setState({ lastNameField: e.target.value })} required/>
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="text" id="email" value={this.state.emailField} onBlur={(e) => this.validation(e.target)} onChange={(e) => this.setState({ emailField: e.target.value })} disabled required/>
                </FormGroup>
                <FormGroup>
                    <Label for="phone">Phone</Label>
                    <Input type="text" id="phone" value={this.state.phoneField} onBlur={(e) => this.validation(e.target)} 
                    onChange={(e) => {
                      if (/^[0-9\-+]{0,15}$/.test(e.target.value)) {
                        this.setState({ phoneField: e.target.value })
                      }
                    }} required/>
                </FormGroup>
                <FormGroup>
                    <Label for="sex">Sex</Label>
                    <Input type="select" id="sex" value={this.state.sexField} onBlur={(e) => this.validation(e.target)} onChange={(e) => this.setState({ sexField: e.target.value })} required>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="img">Img</Label>
                  <Input className="mb-2" type="file" id="img" 
                  onChange={(e) => this.uploadImage(e)}/>
                  {this.state.imgField && (<img style={{ width: 100, height: 100 }} src={this.state.imgField} alt="qwe"/>)}
                  
                </FormGroup>
                <FormGroup>
                    <Label for="birthday">Birthday</Label>
                    <DatePicker className="form-control" id="birthday" selected={this.state.birthdayField} onBlur={(e) => this.validation(e.target)} onChange={(birthdayField) => this.setState({ birthdayField })} dateFormat="dd/MM/yyyy"/>
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" id="address" value={this.state.addressField} onBlur={(e) => this.validation(e.target)} onChange={(e) => this.setState({ addressField: e.target.value })} required/>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" type="submit" form="form">Save</Button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
        <Alert className="profile-edit__alert" color={this.state.alertStatus} isOpen={this.state.alertVisible}>{this.state.alertMsg}</Alert>
      </div>
    );
  }
}

export default Dashboard;
