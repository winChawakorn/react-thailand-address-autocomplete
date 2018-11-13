import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import ReactAutocomplete from 'react-autocomplete'
import ThaiAddress from 'react-thai-address'

class ThailandAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
    }
    this.handleChange = this.handleChange.bind(this)
    this.handelSelect = this.handelSelect.bind(this)
  }

  handleChange(e) {
    const field = this.props.address
    e.target.name = field
    if (this.props.onChange) this.props.onChange(e)
    let { delimiter } = this.props
    delimiter = delimiter.length > 0 ? delimiter : ', '
    let searchKey = field
    switch (searchKey) {
      case 'subdistrict': searchKey = 'tumbon'; break
      case 'district': searchKey = 'city'; break
      default:
    }
    const search = ThaiAddress.search({ [searchKey]: e.target.value }, 10)
    let _search = this.props.filter ? this.props.filter(search) : search
    _search = _search ? _search : search
    this.setState({
      items: _search.map((item, key) => {
        return {
          key,
          label: `${item.tumbon}${delimiter}${item.city}${delimiter}${item.province}${delimiter}${item.zipcode}`
        }
      })
    })
  }

  handelSelect(value) {
    const { delimiter } = this.props
    const address = value.split(delimiter.length > 0 ? delimiter : ', ')
    if (this.props.onSelect)
      this.props.onSelect({
        subdistrict: address[0],
        district: address[1],
        province: address[2],
        zipcode: address[3],
      })
  }

  render() {
    return (
      <div>
        <ReactAutocomplete
          items={this.state.items}
          getItemValue={item => item.label}
          renderItem={(item, highlighted) =>
            <div
              key={item.key}
              style={Object.assign({
                backgroundColor: highlighted ? this.props.highlight : this.props.unhighlight,
                textAlign: 'left',
                border: 'solid #d9d9d9 1px',
                height: '32px',
                padding: '0 5px 0 5px',
                whiteSpace: 'nowrap',
                lineHeight: '32px',
              },
                this.state.items.indexOf(item) !== 0 ? { borderTop: '0' } : {},
                this.props.renderStyle)}
            >
              {item.label}
            </div>
          }
          renderMenu={(items, value, style) => {
            return <div style={{
              ...style,
              ...this.menuStyle,
              zIndex: '999',
              position: 'absolute',
              top: 'auto',
              left: 'auto',
            }}>
              {items}
            </div>
          }}
          inputProps={{
            placeholder: this.props.placeholder,
            style: Object.assign({
              height: '32px',
              width: '120px',
              borderRadius: '4px',
              border: 'solid #d9d9d9 1px',
              paddingLeft: '10px',
              fontSize: '15px',
            }, this.props.style),
          }}
          value={this.props.value}
          onChange={(e) => this.handleChange(e)}
          onSelect={(value) => this.handelSelect(value)}
        />
      </div>
    )
  }
}

ThailandAddress.defaultProps = {
  delimiter: ", ",
  placeholder: '',
  highlight: '#eee',
  unhighlight: 'white',
  style: {},
  renderStyle: {},
  value: '',
  address: 'subdistrict',
  onChange: () => { },
  onSelect: () => { },
}

ThailandAddress.propTypes = {
  address: PropTypes.string,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  delimiter: PropTypes.string,
  placeholder: PropTypes.string,
  highlight: PropTypes.string,
  unhighlight: PropTypes.string,
  style: PropTypes.shape({}),
  renderStyle: PropTypes.shape({}),
}

export default ThailandAddress