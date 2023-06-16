
interface Canvas {
  id:string;
  with:number;
  heigth:number;
  background:number
  components: Component[];
}

interface Component {
  id: string
  left: number;
  top: number;
  radius: number;
  rx: number;
  ry: number;
  fill: string;
  name: string;
  image_url:string;

}

