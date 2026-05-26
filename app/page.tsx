import Image from "next/image";
import Lote from "../components/Mapa"; 

export default function Home() {
  return (
    <div>
      <div className="relative w-full max-w-4xl mx-auto">
        <Image 
          src="/Plano_jpg.jpg" 
          alt="Plano" 
          width={3178} 
          height={4460} 
          className="w-full"
        />
        
        <div className="absolute top-0 left-0 w-full h-full">
          <Lote />
        </div>
      </div>
    </div>
  );
}