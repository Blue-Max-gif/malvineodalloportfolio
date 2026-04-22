import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import skillsRouter from "./skills";
import experienceRouter from "./experience";
import educationRouter from "./education";
import interestsRouter from "./interests";
import goalsRouter from "./goals";
import contactRouter from "./contact";
import dashboardRouter from "./dashboard";
import storageRouter from "./storage";
import messagesRouter from "./messages";
import highlightsRouter from "./highlights";
import adminAuthRouter from "./adminAuth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(skillsRouter);
router.use(experienceRouter);
router.use(educationRouter);
router.use(interestsRouter);
router.use(goalsRouter);
router.use(contactRouter);
router.use(dashboardRouter);
router.use(storageRouter);
router.use(messagesRouter);
router.use(highlightsRouter);
router.use(adminAuthRouter);

export default router;
