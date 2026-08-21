using System.Text.Json;
using System.Xml.Linq;
namespace Ananth
{
    public class Ananth
    {
        public String name{get;set;}
        public int age{get;set;}
        public String subject{get;set;}
        public static void Main(String[] arg)
        {
            
            String json="""
            {
            "name":"Ananth",
            "age":20,
            "subject":"java"
            }
            """;
            String json2=@"{
            ""name"":""AnanthVpy"",
            ""age"":22,
            ""subject"":""Java""

            }";

            String xml="""
            <root>
                <fullname>Mass Ananth</fullname>
            </root>
            """;

            var val=JsonSerializer.Deserialize<Ananth>(json);
            Console.WriteLine(val.name);
            Console.WriteLine(val.age);
            Console.WriteLine(val.subject);
            var val2=JsonSerializer.Deserialize<Ananth>(json2);
            Ananth ananth=new Ananth();
            ananth.name="Siddarth";
            String objectToJson=JsonSerializer.Serialize(ananth);
            Console.WriteLine(objectToJson);
            Console.WriteLine(val2.age+" "+val2.name+" "+val2.subject);
            XDocument doc=XDocument.Parse(xml);
            String name=doc.Root.Element("fullname").Value;
            Console.WriteLine(name);
            Console.WriteLine(doc.Root.Element("fullname"));
            Console.WriteLine(doc);
            Console.WriteLine(XDocument.Parse(xml));

         
        }
    }
}