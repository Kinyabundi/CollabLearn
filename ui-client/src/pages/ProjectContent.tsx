import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil } from "lucide-react"


const ViewProject = () => {
    return (
        <div className="flex flex-col items-center mt-6 h-screen w-full">
            <div className="max-w-4xl w-full">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-2xl">CollabLearn <Badge variant="secondary">Public</Badge>
                    </h2>
                    <Button className="bg-white hover:bg-gray-100 duration-200 transition-colors"> <Pencil className="text-gray-700" /></Button>
                </div>
                <hr className="border border-gray-300" />
            </div>
            <div className="px-3 max-w-4xl w-full mt-4">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At natus ab qui provident repellat, impedit molestias aliquid a id? Excepturi architecto enim esse, eaque id velit, fuga saepe itaque recusandae distinctio doloribus. Maxime id voluptas iure odio ipsam exercitationem reprehenderit eius quas necessitatibus quam quibusdam dolorum repellat non repudiandae, voluptatem pariatur, excepturi at atque optio dignissimos eum illum quidem accusantium assumenda. Labore delectus, quae voluptatem laboriosam pariatur aliquam minima? Esse quisquam ducimus rerum beatae sunt nam explicabo laborum asperiores mollitia soluta repellendus quis quo sapiente, magni neque dolor ut illum. Ducimus voluptatum illo non eos atque numquam vero culpa iste.</p>
            <br />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque accusantium deleniti modi deserunt ipsa quisquam cupiditate praesentium, pariatur eum, dolore commodi libero nihil reprehenderit, possimus natus adipisci saepe expedita veniam illo reiciendis? Ea accusamus unde cum optio, iusto hic harum. Ipsam nihil distinctio deserunt provident, tempora, natus saepe, atque magnam iusto numquam modi illum a. Totam iste suscipit maiores, animi rerum veritatis ipsa pariatur fugiat asperiores autem quisquam fuga vel incidunt error in? Placeat, consectetur fugit doloribus enim minus, at, corporis nostrum quisquam repudiandae earum cumque! Placeat sint culpa aliquam saepe. Consectetur culpa aliquid itaque molestiae adipisci quasi qui totam?</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum veritatis nihil incidunt voluptates, laudantium officiis sit perferendis eos dolores. Quasi aut voluptatibus vitae voluptatem repellat quod enim, ipsum eveniet laudantium. Expedita ullam repellendus corporis repudiandae perspiciatis quo laboriosam laborum vero aut cumque sunt, consequatur consectetur officiis et qui delectus suscipit quis! Dolore maxime incidunt autem ullam tenetur itaque et voluptas architecto, soluta eaque? Rem totam unde autem fugiat distinctio iusto dolor inventore hic repellat, quis recusandae. Nesciunt, omnis. Sapiente necessitatibus rem aperiam exercitationem! Voluptatem, harum praesentium nobis molestiae magni, distinctio labore dignissimos officia aspernatur tempore impedit recusandae, maxime dolorem in.</p>
            </div>

        </div>
    )
}

export default ViewProject
