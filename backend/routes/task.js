const express = require("express");
const router = express.Router();
const TaskModel = require("../model/task");
const SubTaskModel = require("../model/subtask");
const { red } = require("@material-ui/core/colors");

router.post("/add", (req, res) => {
  const task = new TaskModel(req.body);
  console.log(req.body);

  task.save((err) => {
    // if(err) return res.status(400).json({msg:"error while saving proces"})
    if (err) console.log(err);
    return res.status(200).json({ success: true });
  });
});
router.post("/addsubtask", (req, res) => {
  const subtask = new SubTaskModel(req.body);
  console.log(req.body);

  subtask.save((err) => {
    // if(err) return res.status(400).json({msg:"error while saving proces"})
    if (err) console.log(err);
    return res.status(200).json({ success: true });
  });
});

router.get("/alltask", (req, res) => {
  TaskModel.aggregate([
    {
      $lookup: {
        from: "subtaskmodels",
        let: {
          subtaskOf: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$subtaskOf", "$$subtaskOf"],
              },
            },
          },
        ],
        as: "subtasks",
      },
    //   $sort : { createdAt : -1}
    },
    
  ])

    .then((result) => {
        return res.status(200).json(result);

    })
    .catch((err) => console.log(err));
});


// let pipeline = [
    //     { $match: query },
    //     {
        //       $lookup: {
            //         from: "jobs",
            //         localField: "jobId",
            //         foreignField: "_id",
//         as: "job",
//       },
//     },
//     {
    //       $addFields: {
        //         job: { $arrayElemAt: ["$job", 0] },
//       },
//     },
//     {
    //       $project: project,
    //     },
    //     { $sort: sort },
    //   ];
    
router.put('/:id',(req,res)=>{
        console.log(req.body)
        if(req.body.status=== "complete"){

          SubTaskModel.updateMany({subtaskOf:req.params.id},{$set:req.body},(err,task)=>{
             console.log(task)
          })
        }
        TaskModel.findByIdAndUpdate(req.params.id,{$set:req.body},(err,task)=>{
          if(err)return res.status(400).json({success:false,err})
          return res.status(200).json({success:true,task})
      })

    })
    
router.put('/subtask/:id',(req,res)=>{
        console.log(req.body)
        SubTaskModel.findByIdAndUpdate(req.params.id,{$set:req.body},(err,task)=>{
            if(err)return res.status(400).json({success:false,err})
            return res.status(200).json({success:true,task})
        })
    })


    

module.exports = router;