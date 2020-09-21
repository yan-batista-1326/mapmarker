import React, {Component} from 'react';
import Konva from 'konva';

import './styles.css';

import MarkerIcon from '../../icon/marker.png';

let stage = null;
let imageLayer = null;
let textLayer = null;
let markerLayer = null;

export default class Sidebar extends Component {
    componentDidMount() {
        Sidebar.initialize();
    }

    static initialize() {
        //Create Stage
        stage = new Konva.Stage({
            container: 'contentCanvas',
            width: 720,
            height: 720
        });

        //Create Layers
        imageLayer = new Konva.Layer();
        markerLayer = new Konva.Layer();
        textLayer = new Konva.Layer();
    }

    static removeAll() {
        stage.remove();
    }

    addPhoto() {
        const reader = new FileReader();
        const file = document.getElementById('addPhoto').files[0];

        reader.onload = (e) => {
            const result = e.target.result;

            let mapObj = new Image();
            mapObj.src = result;

            mapObj.onload = () => {
                let mapKonva = new Konva.Image({
                    image: mapObj,
                    width: 720,
                    height: 720,
                    offsetX: 720/2,
                    offsetY: 720/2,
                    x: stage.width()/2,
                    y: stage.height()/2
                });

                //Check if there is an image
                if(imageLayer.find('Image').length > 0) {
                    Sidebar.removeAll();
                    Sidebar.initialize();
                }

                imageLayer.add(mapKonva);
                imageLayer.batchDraw();
                stage.add(imageLayer);
            }
        }
        reader.readAsDataURL(file);
    }

    addMarker() {
        if(imageLayer.find('Image').length > 0) { //If there is an image
            let markerObj = new Image();
            markerObj.src = MarkerIcon;

            markerObj.onload = () => {
                let markerKonva = new Konva.Image({
                    image: markerObj,
                    width: 50,
                    height: 50,
                    draggable: true,
                    x: stage.width()/2,
                    y: stage.height()/2
                });
                markerLayer.add(markerKonva);
                markerLayer.batchDraw();

                markerKonva.on('dragend', () => { //Check if the element is out of bounds and delete it if it is
                    let markerPos = markerKonva.getPosition();
                    if(markerPos.x > (stage.width() - 50) || markerPos.x < 0 || markerPos.y > (stage.height() - 50) || markerPos.y < 0) {
                        markerKonva.destroy();
                        markerLayer.batchDraw();
                    }
                });

                stage.add(markerLayer);
            }
        }
    }

    addText() {
        if(imageLayer.find('Image').length > 0) { //If there is an image
            //Create Text Input
            let textInput = document.createElement('input');
            textInput.type = "text";
            textInput.id = "insertTextInput";
            textInput.style.textTransform = "uppercase"
            document.getElementById('contentCanvas').appendChild(textInput);
            textInput.focus();

            //Send text event
            textInput.addEventListener('keypress', (e) => {
                let konvaText = null;
                if(e.keyCode === 13) { //Check Enter
                    let textValue = textInput.value;
                    //Create and Add Konva Text to the layer
                    konvaText = new Konva.Text({
                        text: textValue.toUpperCase(),
                        fontSize: 20,
                        draggable: true,
                        x: stage.width()/2,
                        y: stage.height()/2,
                        fill: 'black',
                        name: 'textContent'
                    });
                    textLayer.add(konvaText);

                    konvaText.on('dragend', () => { //Check if the element is out of bounds and delete it if it is
                        let textPos = konvaText.getPosition();
                        if(textPos.x > (stage.width() - 50) || textPos.x < 0 || textPos.y > (stage.height() - 50) || textPos.y < 0) {
                            konvaText.destroy();
                            textLayer.batchDraw();
                        }
                    });

                    stage.add(textLayer);

                    //Remove Input and related listeners
                    document.removeEventListener('click', (e));
                    textInput.remove();
                }
            });

            //Check if there is a click outside the element, and remove it
            document.addEventListener('click', (e) => {
                if(e.target !== textInput) {
                    document.removeEventListener('click', (e));
                    textInput.remove();
                }
            });

            //Create the transformer
            let konvaTransformer = new Konva.Transformer();
            textLayer.add(konvaTransformer);

            //Check if user clicked on the text and select it
            stage.on('click', (e) => {
                if(!e.target.hasName('textContent'))
                    konvaTransformer.nodes([]);
                else
                    konvaTransformer.nodes([e.target]);

                textLayer.batchDraw(); 
            });
        }
    }

    saveMap() {
        if(imageLayer.find('Image').length > 0) { //Check if there is an image to be saved
            let link = document.createElement('a');
            link.download = 'map.png';
            link.href = stage.toDataURL({pixelRatio: 1});
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    render() {
        return(
            <div className="sidebar">
                <ul>
                    <li><img src="https://img.icons8.com/metro/26/000000/cursor.png" alt="cursor_icon"/></li>
                    <li><img src="https://img.icons8.com/ios/50/000000/marker.png" alt="marker_icon" onClick={this.addMarker}/></li>
                    <li><img src="https://img.icons8.com/material-sharp/24/000000/text.png" alt="text_icon" onClick={this.addText}/></li>
                    <li><img src="https://img.icons8.com/ios/50/000000/save.png" alt="save_icon" onClick={this.saveMap}/></li>
                    <li>
                        <label htmlFor="addPhoto"><img src="https://img.icons8.com/pastel-glyph/64/000000/plus.png" alt="add_icon"/></label>
                        <input onChange={this.addPhoto} type="file" name="photo" id="addPhoto" accept="image/png, image/jpeg, /image/jpg"></input>
                    </li>
                </ul>
            </div>
        );
    }
}