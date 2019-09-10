import React, { Component } from "react";
import axios from "axios";
import { Button, Table, Input, Form, FormGroup, Label } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      name: "",
      salary: "",
      monthlyTax: ""
    };
  }

  //something
  componentDidMount() {
    this._refreshList();
  }

  // onChange function for form
  Change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  //onSubmit
  onSubmit = e => {
    e.preventDefault();

    let { name, salary, items, monthlyTax } = this.state;

    //conditional calculations for Tax
    if (salary <= 195850) {
      let Tax = salary * 0.18;
      monthlyTax = salary - Tax;
    } else if (salary >= 195851 && salary <= 305850) {
      let tax = salary * 0.26;
      monthlyTax = tax + 35253;
    } else if (salary >= 305851 && salary <= 423300) {
      let tax = salary * 0.31;
      monthlyTax = tax + 63853;
    } else if (salary >= 423301 && salary <= 555600) {
      let tax = salary * 0.36;
      monthlyTax = tax + 100263;
    } else if (salary >= 555601 && salary <= 708310) {
      let tax = salary * 0.39;
      monthlyTax = tax + 147891;
    } else if (salary >= 708311 && salary <= 1500000) {
      let tax = salary * 0.41;
      monthlyTax = tax + 207488;
    } else if (salary >= 1500001) {
      let tax = salary * 0.45;
      monthlyTax = tax + 532041;
    }

    //make an object for all our values to pass into to the array
    let newItemData = {
      name: name,
      salary: `R${salary}`,
      monthlyTax: `R${monthlyTax}`
    };
    //set state for newItemData object
    newItemData !== "" &&
      this.setState({
        items: [...items, newItemData],

        name: "",
        salary: "",
        monthlyTax: ""
      });

    axios({
      method: "post",
      url: "http://localhost:3000/salaries",
      data: newItemData,
      validateStatus: status => {
        return true; // I'm always returning true, you may want to do it depending on the status received
      }
    })
      .then(response => {
        items.push(response.data);

        this.setState({
          items,
          newItemModal: false,
          newItemData: {
            title: "",
            description: "",
            url: ""
          }
        });
      })
      .catch(error => {
        console.log(error.message);
      });
    this._refreshList();
  };

  //delete function
  deleteItem(e, id) {
    let index = this.state.items.findIndex(e => e.id === id);
    let newItems = this.state.items.slice();
    newItems.splice(index, 1);
    this.setState({ items: newItems });
    console.log(newItems);

    fetch("/salaries", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newItems)
    })
      .then(res => res.json())
      .then(response => alert("Success", JSON.stringify(response)))
      .catch(error => console.log("Error", error));
    this._refreshList();
  }

  //get function
  _refreshList() {
    axios
      .get("http://localhost:3000/salaries")
      .then(response => {
        this.setState({
          items: response.data
        });
      })
      .catch(error => console.log("Error", error));
  }

  render() {
    const { items, name, salary } = this.state;

    return (
      <div className="App container">
        <h1>Income Tax Calculator</h1>
        <br />
        {/* form for salary input */}
        <Form>
          <FormGroup className="mr-4">
            <Label for="name">Name</Label>
            <Input
              name="name"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={e => this.Change(e)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="salary">Salary</Label>
            <Input
              name="salary"
              type="text"
              placeholder="Enter income"
              value={salary}
              onChange={e => this.Change(e)}
            />
          </FormGroup>
          <Button color="primary" onClick={e => this.onSubmit(e)}>
            Submit
          </Button>
        </Form>
        <br />
        {/* table for user data */}
        <Table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Salary</td>
              <td>Monthly Tax</td>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.salary}</td>
                  <td>{item.monthlyTax}</td>
                  <td>
                    <Button
                      color="outline-danger"
                      size="sm"
                      onClick={this.deleteItem.bind(this, item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
