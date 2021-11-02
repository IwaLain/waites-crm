import React, { Component } from 'react';
import { Card, Button, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import '../../assets/styles/customStyles.css'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      modal: false,
      date: new Date(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      sex: '',
      address: '',
      img: 'user1.png',
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
              }
              break
          case 'lastName':
              if (!name.test(el.value)) {
                  validationError = 'Name is not valid.'
                  el.classList.add('is-invalid')
              } else if (el.value.length <= 3) {
                  validationError = 'Name must contain more than 3 symbols.'
                  el.classList.add('is-invalid')
              }
              break
          case 'phone':
              if (!phone.test(el.value)) {
                  validationError = 'Phone is not valid.'
                  el.classList.add('is-invalid')
              }
              break
          case 'birthday':
              if (!birthday.test(el.value)) {
                  validationError = 'Date format: 29/03/2001'
                  el.classList.add('is-invalid')
              }
              break
        }

      return validationError
  }

  saveChanges = (e) => {
    e.preventDefault()

    let date = this.state.date
    let birthday = [
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
      this.setState({ user: {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        phone: this.state.phone,
        sex: this.state.sex,
        address: this.state.address,
        birthday,
        img: this.state.img
      }})
  
      this.toggle()
      this.showAlert('Success')
  
      /* Post API request here */
    } else {
      this.showAlert('ValidationError', validationErrors)
    }
  }

  componentDidMount() {
    fetch('db.json')
    .then((res) => res.json())
    .then((data) => {
      let user = data.users[0]
      let formatted = user.birthday.split('/')
      this.setState({ user, date: new Date(`${formatted[1]}/${formatted[0]}/${formatted[2]}`) })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.user !== this.state.user) {
      this.setState({ firstName: this.state.user.firstName })
      this.setState({ lastName: this.state.user.lastName })
      this.setState({ email: this.state.user.email })
      this.setState({ phone: this.state.user.phone })
      this.setState({ sex: this.state.user.sex })
      this.setState({ address: this.state.user.address })
    }
  }

  render() {
    return (
      <div>
        <Card body>
          <div className="text-center">
            <div className="m-b">
              <img src={this.state.user.img === 'user1.png' ? require(`../../assets/images/user1.png`) : this.state.user.img} style={{ width: 100, height: 100 }} className="b-circle" alt="profile" />
            </div>
            <div>
              <h2 className="h4">{this.state.user ? `${this.state.user.firstName} ${this.state.user.lastName}` : '???'}</h2>
              <Button color="dark" onClick={this.toggle}>Edit profile</Button>
              <hr />
              <Row className="text-center m-b">
                <Col>
                  <strong>{this.state.user ? this.state.user.phone : '???'}</strong>
                  <div className="text-muted">Phone</div>
                </Col>
                <Col>
                  <strong>{this.state.user ? this.state.user.email : '???'}</strong>
                  <div className="text-muted">Email</div>
                </Col>
                <Col>
                  <strong>{this.state.user ? this.state.user.birthday : '???'}</strong>
                  <div className="text-muted">Birthday</div>
                </Col>
                <Col>
                  <strong>{this.state.user ? this.state.user.sex : '???'}</strong>
                  <div className="text-muted">Sex</div>
                </Col>
                <Col>
                  <strong>{this.state.user ? this.state.user.address : '???'}</strong>
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
                    <Input type="text" id="firstName" value={this.state.firstName} onChange={(e) => this.setState({ firstName: e.target.value })} required/>
                </FormGroup>
                <FormGroup>
                    <Label for="lastName">Last Name</Label>
                    <Input type="text" id="lastName" value={this.state.lastName} onChange={(e) => this.setState({ lastName: e.target.value })} required/>
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="text" id="email" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} disabled required/>
                </FormGroup>
                <FormGroup>
                    <Label for="phone">Phone</Label>
                    <Input type="text" id="phone" value={this.state.phone} 
                    onChange={(e) => {
                      if (/^[0-9\-\+]{0,15}$/.test(e.target.value)) {
                        this.setState({ phone: e.target.value })
                      }
                    }} required/>
                </FormGroup>
                <FormGroup>
                    <Label for="sex">Sex</Label>
                    <Input type="select" id="sex" value={this.state.sex} onChange={(e) => this.setState({ sex: e.target.value })} required>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="img">Img</Label>
                  <Input type="file" id="img" 
                  onChange={(e) => {
                    this.setState({ img: URL.createObjectURL(e.target.files[0]) })
                  }}/>
                </FormGroup>
                <FormGroup>
                    <Label for="birthday">Birthday</Label>
                    <DatePicker className="form-control" id="birthday" selected={this.state.date} onChange={(date) => this.setState( { date } )} dateFormat="dd/MM/yyyy"/>
                </FormGroup>
                <FormGroup>
                    <Label for="address">Address</Label>
                    <Input type="text" id="address" value={this.state.address} onChange={(e) => this.setState({ address: e.target.value })} required/>
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
