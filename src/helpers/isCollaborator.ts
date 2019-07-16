import { GITHUB_AUTHOR_ASSOCIATION } from "../constants";

/**
 * Is this Github user contextualized role a collaborator-like one?
 */
export default function isCollaborator(role: string): boolean {
  return [GITHUB_AUTHOR_ASSOCIATION.COLLABORATOR, GITHUB_AUTHOR_ASSOCIATION.OWNER].includes(role);
}
