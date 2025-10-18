import { Title } from "@solidjs/meta";
import Dashboard from "~/components/Dashboard";







export default function Home() {
  let user = "wayne"; 






















  return (

   
    <main>
      <Title>Recluta!</Title>
      <h2>Hello {user}</h2>



      
          <h3> 
          Here are the priorities for today!   
          </h3> 

      

          



          <div> 


                        


                








                  <Dashboard />    {/* Leave this for a service or function later.   */}
                  
          </div> 
          <div class="backy">
       
          </div>

      
      
      <p>
        Visit{" "}

        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>




   


    </main>
  );
}
